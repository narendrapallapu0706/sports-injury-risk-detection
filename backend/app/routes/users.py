from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.dependencies import get_current_user
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import (
    create_user,
    get_user_by_email,
    get_user_by_username,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    """Register a new user."""

    existing_username = get_user_by_username(
        db,
        user_data.username,
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )

    existing_email = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    return create_user(db, user_data)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user_profile(
    current_user = Depends(get_current_user),
):
    """Get the currently authenticated user's profile."""

    return current_user