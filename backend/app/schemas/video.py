from datetime import datetime
from typing import Any

from pydantic import BaseModel


class VideoResponse(BaseModel):
    id: int
    original_filename: str
    stored_filename: str
    file_path: str
    status: str
    frames_processed: int | None = None
    analysis_features: dict[str, Any] | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }