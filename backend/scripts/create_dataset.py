import sys
from pathlib import Path

# Add the backend root (/app) to Python's import path
sys.path.insert(
    0,
    str(Path(__file__).resolve().parent.parent),
)

import csv

from app.services.pose_service import extract_pose_landmarks
from app.services.feature_service import extract_video_features


VIDEO_DIR = Path("uploads/videos")
OUTPUT_FILE = Path("dataset/features.csv")


def process_video(video_path: Path):
    print(f"Processing: {video_path.name}")

    frame_results = extract_pose_landmarks(str(video_path))

    if not frame_results:
        print("  No pose data detected.")
        return None

    # Get FPS from the pose result.
    # Our current pose service stores FPS in the frame results.
    fps = frame_results[0].get("fps", 25.0)

    features = extract_video_features(
        frame_results,
        fps,
    )

    return features


def main():
    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    video_files = [
        path
        for path in VIDEO_DIR.iterdir()
        if path.suffix.lower() in {
            ".mp4",
            ".avi",
            ".mov",
            ".mkv",
        }
    ]

    if not video_files:
        print("No videos found.")
        return

    rows = []

    for video_path in video_files:
        try:
            features = process_video(video_path)

            if features is None:
                continue

            row = {
                "video_id": video_path.stem,
                **features,
            }

            rows.append(row)

            print(
                f"  Extracted {len(features)} features."
            )

        except Exception as error:
            print(
                f"  Failed to process {video_path.name}: "
                f"{error}"
            )

    if not rows:
        print("No feature rows were generated.")
        return

    fieldnames = [
        "video_id",
        *rows[0].keys(),
    ]

    # Remove duplicate video_id if necessary.
    fieldnames = list(dict.fromkeys(fieldnames))

    with OUTPUT_FILE.open(
        "w",
        newline="",
        encoding="utf-8",
    ) as file:
        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames,
        )

        writer.writeheader()
        writer.writerows(rows)

    print()
    print(f"Dataset created: {OUTPUT_FILE}")
    print(f"Videos processed: {len(rows)}")
    print(f"Features per video: {len(fieldnames) - 1}")


if __name__ == "__main__":
    main()