"""add analysis data to videos

Revision ID: add_analysis_data_to_videos
Revises: 36a6882b7357
Create Date: 2026-09-10
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_analysis_data_to_videos"
down_revision: Union[str, Sequence[str], None] = "36a6882b7357"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "videos",
        sa.Column(
            "frames_processed",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "videos",
        sa.Column(
            "analysis_features",
            sa.JSON(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "videos",
        "analysis_features",
    )

    op.drop_column(
        "videos",
        "frames_processed",
    )