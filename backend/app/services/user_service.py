from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.services.security import hash_password, verify_password


def get_user_by_username(
    db: Session,
    username: str,
) -> User | None:
    """Find a user by username."""
    statement = select(User).where(User.username == username)

    return db.scalar(statement)


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """Find a user by email."""
    statement = select(User).where(User.email == email)

    return db.scalar(statement)


def authenticate_user(
    db: Session,
    username: str,
    password: str,
) -> User | None:
    """Authenticate a user using username and password."""

    user = get_user_by_username(db, username)

    if user is None:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


def create_user(
    db: Session,
    user_data: UserCreate,
) -> User:
    """Create a new user."""

    hashed_password = hash_password(user_data.password)

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user