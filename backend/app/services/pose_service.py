from pathlib import Path

import cv2
import mediapipe as mp


MODEL_PATH = Path("/app/models/pose_landmarker_lite.task")


def extract_pose_landmarks(video_path: str) -> list[dict]:
    """
    Extract pose landmarks from a video using
    MediaPipe Pose Landmarker.
    """

    video = Path(video_path)

    if not video.exists():
        raise FileNotFoundError(
            f"Video not found: {video_path}"
        )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Pose model not found: {MODEL_PATH}"
        )

    cap = cv2.VideoCapture(str(video))

    if not cap.isOpened():
        raise RuntimeError(
            f"Unable to open video: {video_path}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps <= 0:
        fps = 30.0

    frames = []

    options = mp.tasks.vision.PoseLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(
            model_asset_path=str(MODEL_PATH)
        ),
        running_mode=mp.tasks.vision.RunningMode.VIDEO,
        num_poses=1,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    try:
        with mp.tasks.vision.PoseLandmarker.create_from_options(
            options
        ) as landmarker:

            frame_number = 0

            while True:
                success, frame = cap.read()

                if not success:
                    break

                frame_number += 1

                timestamp_ms = int(
                    (frame_number - 1) * 1000 / fps
                )

                rgb_frame = cv2.cvtColor(
                    frame,
                    cv2.COLOR_BGR2RGB,
                )

                mp_image = mp.Image(
                    image_format=mp.ImageFormat.SRGB,
                    data=rgb_frame,
                )

                result = landmarker.detect_for_video(
                    mp_image,
                    timestamp_ms,
                )

                landmarks = []

                if result.pose_landmarks:
                    pose = result.pose_landmarks[0]

                    for landmark in pose:
                        landmarks.append(
                            {
                                "x": landmark.x,
                                "y": landmark.y,
                                "z": landmark.z,
                                "visibility": landmark.visibility,
                            }
                        )

                frames.append(
                    {
                        "frame": frame_number,
                        "timestamp_ms": timestamp_ms,
                        "fps": fps,
                        "landmarks": landmarks,
                    }
                )

    finally:
        cap.release()

    return frames