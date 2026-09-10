from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.video import Video
from app.schemas.video import VideoResponse
from app.services.pose_service import extract_pose_landmarks
from app.services.feature_service import extract_video_features


router = APIRouter(
    prefix="/videos",
    tags=["Videos"],
)


UPLOAD_DIR = Path("uploads/videos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
}


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
)
async def upload_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload an athlete video for the authenticated user."""

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported video format",
        )

    stored_filename = f"{uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / stored_filename

    try:
        with file_path.open("wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                buffer.write(chunk)

    except Exception:
        if file_path.exists():
            file_path.unlink()
        raise

    finally:
        await file.close()

    video = Video(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=stored_filename,
        file_path=str(file_path),
        status="uploaded",
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return {
        "message": "Video uploaded successfully",
        "video_id": video.id,
        "filename": video.original_filename,
        "status": video.status,
    }


@router.get(
    "/",
    response_model=list[VideoResponse],
)
def list_videos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List videos uploaded by the authenticated user."""

    statement = (
        select(Video)
        .where(Video.user_id == current_user.id)
        .order_by(Video.created_at.desc())
    )

    videos = db.scalars(statement).all()

    return videos


@router.get(
    "/{video_id}",
    response_model=VideoResponse,
)
def get_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific video belonging to the authenticated user."""

    statement = (
        select(Video)
        .where(
            Video.id == video_id,
            Video.user_id == current_user.id,
        )
    )

    video = db.scalar(statement)

    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )

    return video


@router.post(
    "/{video_id}/analyze",
)
def analyze_video(
    video_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze an uploaded athlete video using pose estimation."""

    statement = (
        select(Video)
        .where(
            Video.id == video_id,
            Video.user_id == current_user.id,
        )
    )

    video = db.scalar(statement)

    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )

    if video.status != "uploaded":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Video cannot be analyzed because its "
                f"status is '{video.status}'"
            ),
        )

    video.status = "processing"
    db.commit()
    db.refresh(video)

    try:
        # 1. Extract body landmarks from the video.
        frame_results = extract_pose_landmarks(video.file_path)

        if not frame_results:
            raise ValueError("No frames could be processed.")

        fps = frame_results[0].get("fps", 30.0)

        # 2. Extract biomechanical and movement features.
        features = extract_video_features(
            frame_results,
            fps,
        )

        # 3. Store analysis results permanently in the database.
        video.frames_processed = len(frame_results)
        video.analysis_features = features
        video.status = "completed"

        db.commit()
        db.refresh(video)

        return {
            "message": "Video analysis completed",
            "video_id": video.id,
            "status": video.status,
            "frames_processed": video.frames_processed,
            "features": video.analysis_features,
        }

    except Exception as exc:
        video.status = "uploaded"
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video analysis failed: {str(exc)}",
        )