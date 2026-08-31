from app.database.connection import SessionLocal
from app.models.user import User
from app.services.security import hash_password


db = SessionLocal()

try:
    user = User(
        username="narendra",
        email="narendra@example.com",
        hashed_password=hash_password("test123"),
        is_active=True,
    )

    db.add(user)
    db.commit()

    print("User created successfully!")

except Exception as e:
    db.rollback()
    print(f"Error: {e}")

finally:
    db.close()