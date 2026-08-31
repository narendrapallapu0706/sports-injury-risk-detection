import math


# MediaPipe Pose landmark indices
NOSE = 0

LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12

LEFT_ELBOW = 13
RIGHT_ELBOW = 14

LEFT_WRIST = 15
RIGHT_WRIST = 16

LEFT_HIP = 23
RIGHT_HIP = 24

LEFT_KNEE = 25
RIGHT_KNEE = 26

LEFT_ANKLE = 27
RIGHT_ANKLE = 28


def calculate_angle(point_a, point_b, point_c):
    """
    Calculate the angle ABC in degrees.

    point_b is the joint where the angle is measured.
    """

    vector_ba = (
        point_a["x"] - point_b["x"],
        point_a["y"] - point_b["y"],
        point_a["z"] - point_b["z"],
    )

    vector_bc = (
        point_c["x"] - point_b["x"],
        point_c["y"] - point_b["y"],
        point_c["z"] - point_b["z"],
    )

    dot_product = sum(
        a * b
        for a, b in zip(vector_ba, vector_bc)
    )

    magnitude_ba = math.sqrt(
        sum(value * value for value in vector_ba)
    )

    magnitude_bc = math.sqrt(
        sum(value * value for value in vector_bc)
    )

    if magnitude_ba == 0 or magnitude_bc == 0:
        return None

    cosine_angle = dot_product / (
        magnitude_ba * magnitude_bc
    )

    cosine_angle = max(-1.0, min(1.0, cosine_angle))

    return math.degrees(
        math.acos(cosine_angle)
    )


def get_landmark(landmarks, index):
    """
    Safely get a landmark by MediaPipe index.
    """

    if index >= len(landmarks):
        return None

    return landmarks[index]

def valid_landmark(landmark, min_visibility=0.5):
    """
    Check whether a landmark has sufficient visibility.
    """

    if landmark is None:
        return False

    visibility = landmark.get("visibility")

    if visibility is None:
        return True

    return visibility >= min_visibility

def calculate_frame_features(landmarks):
    """
    Calculate biomechanical features for one frame.
    """

    features = {}

    left_shoulder = get_landmark(
        landmarks, LEFT_SHOULDER
    )
    right_shoulder = get_landmark(
        landmarks, RIGHT_SHOULDER
    )

    left_hip = get_landmark(
        landmarks, LEFT_HIP
    )
    right_hip = get_landmark(
        landmarks, RIGHT_HIP
    )

    left_knee = get_landmark(
        landmarks, LEFT_KNEE
    )
    right_knee = get_landmark(
        landmarks, RIGHT_KNEE
    )

    left_ankle = get_landmark(
        landmarks, LEFT_ANKLE
    )
    right_ankle = get_landmark(
        landmarks, RIGHT_ANKLE
    )

    left_elbow = get_landmark(
        landmarks, LEFT_ELBOW
    )
    right_elbow = get_landmark(
        landmarks, RIGHT_ELBOW
    )

    left_wrist = get_landmark(
        landmarks, LEFT_WRIST
    )
    right_wrist = get_landmark(
        landmarks, RIGHT_WRIST
    )

    # Left knee angle
    if (
    valid_landmark(left_hip)
    and valid_landmark(left_knee)
    and valid_landmark(left_ankle)
):
        features["left_knee_angle"] = calculate_angle(
            left_hip,
            left_knee,
            left_ankle,
        )
        
    # Right knee angle
    if (
        valid_landmark(right_hip)
        and valid_landmark(right_knee)
        and valid_landmark(right_ankle)
    ):
        features["right_knee_angle"] = calculate_angle(
            right_hip,
            right_knee,
            right_ankle,
        )

    # Left hip angle
    if (
        valid_landmark(left_shoulder)
        and valid_landmark(left_hip)
        and valid_landmark(left_knee)
    ):
        features["left_hip_angle"] = calculate_angle(
            left_shoulder,
            left_hip,
            left_knee,
        )

    # Right hip angle
    if (
            valid_landmark(right_shoulder)
            and valid_landmark(right_hip)
            and valid_landmark(right_knee)
        ):
        features["right_hip_angle"] = calculate_angle(
            right_shoulder,
            right_hip,
            right_knee,
        )

    # Left elbow angle
    if (
            valid_landmark(left_shoulder)
            and valid_landmark(left_elbow)
            and valid_landmark(left_wrist)
        ):
        features["left_elbow_angle"] = calculate_angle(
            left_shoulder,
            left_elbow,
            left_wrist,
        )

    # Right elbow angle
    if (
                valid_landmark(right_shoulder)
                and valid_landmark(right_elbow)
                and valid_landmark(right_wrist)
            ):
        features["right_elbow_angle"] = calculate_angle(
            right_shoulder,
            right_elbow,
            right_wrist,
        )
        
    return features

def calculate_video_features(frame_results: list[dict]) -> dict:
    """
    Calculate summary biomechanical features across an entire video.
    """

    frame_features = []

    for frame in frame_results:
        landmarks = frame.get("landmarks", [])

        if not landmarks:
            continue

        features = calculate_frame_features(landmarks)

        if features:
            frame_features.append(features)

    if not frame_features:
        raise ValueError(
            "No pose landmarks were detected in the video."
        )

    def get_values(feature_name):
        return [
            frame[feature_name]
            for frame in frame_features
            if feature_name in frame
            and frame[feature_name] is not None
        ]

    def get_min(feature_name):
        values = get_values(feature_name)
        return min(values) if values else None

    def get_max(feature_name):
        values = get_values(feature_name)
        return max(values) if values else None

    def get_range(feature_name):
        values = get_values(feature_name)

        if not values:
            return None

        return max(values) - min(values)

    features = {
        "left_knee_min": get_min("left_knee_angle"),
        "left_knee_max": get_max("left_knee_angle"),
        "left_knee_rom": get_range("left_knee_angle"),

        "right_knee_min": get_min("right_knee_angle"),
        "right_knee_max": get_max("right_knee_angle"),
        "right_knee_rom": get_range("right_knee_angle"),

        "left_hip_min": get_min("left_hip_angle"),
        "left_hip_max": get_max("left_hip_angle"),
        "left_hip_rom": get_range("left_hip_angle"),

        "right_hip_min": get_min("right_hip_angle"),
        "right_hip_max": get_max("right_hip_angle"),
        "right_hip_rom": get_range("right_hip_angle"),

        "left_elbow_min": get_min("left_elbow_angle"),
        "left_elbow_max": get_max("left_elbow_angle"),
        "left_elbow_rom": get_range("left_elbow_angle"),

        "right_elbow_min": get_min("right_elbow_angle"),
        "right_elbow_max": get_max("right_elbow_angle"),
        "right_elbow_rom": get_range("right_elbow_angle"),
    }

    # Left/right knee range-of-motion asymmetry
    if (
        features["left_knee_rom"] is not None
        and features["right_knee_rom"] is not None
    ):
        features["knee_rom_asymmetry"] = abs(
            features["left_knee_rom"]
            - features["right_knee_rom"]
        )

    # Left/right hip range-of-motion asymmetry
    if (
        features["left_hip_rom"] is not None
        and features["right_hip_rom"] is not None
    ):
        features["hip_rom_asymmetry"] = abs(
            features["left_hip_rom"]
            - features["right_hip_rom"]
        )

    # Left/right elbow range-of-motion asymmetry
    if (
        features["left_elbow_rom"] is not None
        and features["right_elbow_rom"] is not None
    ):
        features["elbow_rom_asymmetry"] = abs(
            features["left_elbow_rom"]
            - features["right_elbow_rom"]
        )

    features["frames_with_pose"] = len(frame_features)

    return features

def smooth_values(values, window_size=5):
    """
    Smooth a sequence using a simple moving average.
    """

    if not values:
        return []

    if window_size < 2:
        return values.copy()

    smoothed = []

    half_window = window_size // 2

    for i in range(len(values)):
        start = max(0, i - half_window)
        end = min(len(values), i + half_window + 1)

        window = values[start:end]

        smoothed.append(
            sum(window) / len(window)
        )

    return smoothed

def calculate_velocity(values, fps):
    """
    Calculate frame-to-frame angular velocity.

    Returns velocity values in degrees/second.
    """

    if len(values) < 2:
        return []

    if fps <= 0:
        raise ValueError("FPS must be greater than zero.")

    dt = 1.0 / fps

    velocities = []

    for previous, current in zip(values, values[1:]):
        velocity = (current - previous) / dt
        velocities.append(velocity)

    return velocities

def calculate_acceleration(velocities, fps):
    """
    Calculate frame-to-frame angular acceleration.

    Returns acceleration values in degrees/second².
    """

    if len(velocities) < 2:
        return []

    if fps <= 0:
        raise ValueError("FPS must be greater than zero.")

    dt = 1.0 / fps

    accelerations = []

    for previous, current in zip(velocities, velocities[1:]):
        acceleration = (current - previous) / dt
        accelerations.append(acceleration)

    return accelerations

def calculate_video_dynamics(frame_results: list[dict], fps: float) -> dict:
    """
    Calculate movement-dynamics features across the video.
    """

    angle_names = [
        "left_knee_angle",
        "right_knee_angle",
        "left_hip_angle",
        "right_hip_angle",
        "left_elbow_angle",
        "right_elbow_angle",
    ]

    angle_sequences = {
        name: []
        for name in angle_names
    }

    for frame in frame_results:
        landmarks = frame.get("landmarks", [])

        if not landmarks:
            continue

        frame_features = calculate_frame_features(landmarks)

        for name in angle_names:
            value = frame_features.get(name)

            if value is not None:
                angle_sequences[name].append(value)

    dynamics = {}

    for name, values in angle_sequences.items():

        if len(values) < 2:
            dynamics[f"{name.replace('_angle', '')}_max_angular_velocity"] = None
            continue

        smoothed_values = smooth_values(
            values,
            window_size=5,
        )

        velocities = calculate_velocity(
            smoothed_values,
            fps,
        )

        accelerations = calculate_acceleration(
            velocities,
            fps,
        )

        max_velocity = max(
            abs(velocity)
            for velocity in velocities
        )

        max_acceleration = (
            max(abs(acceleration) for acceleration in accelerations)
            if accelerations
            else None
        )

        base_name = name.replace("_angle", "")

        dynamics[
        f"{base_name}_max_angular_velocity"
        ] = max_velocity

        dynamics[
        f"{base_name}_max_angular_acceleration"
        ] = max_acceleration
    return dynamics

def extract_video_features(
    frame_results: list[dict],
    fps: float,
) -> dict:
    """
    Extract the complete feature vector for one video.
    """

    # Existing biomechanical features
    video_features = calculate_video_features(frame_results)

    # Movement-dynamics features
    dynamics_features = calculate_video_dynamics(
        frame_results,
        fps,
    )

    # Combine both feature sets
    features = {
        **video_features,
        **dynamics_features,
    }

    return features