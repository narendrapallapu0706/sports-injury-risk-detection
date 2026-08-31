from datetime import datetime

from pydantic import BaseModel


class VideoResponse(BaseModel):
    id: int
    original_filename: str
    stored_filename: str
    file_path: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }    