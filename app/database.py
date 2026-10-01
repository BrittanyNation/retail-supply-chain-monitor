import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://homedepot_admin:hd_secure_pass_2026@db:5432/supply_chain"
)

# Ensure structural system resilience with automatic retry on database connection loops
engine = None
for attempt in range(5):
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        break
    except Exception as e:
        if attempt < 4:
            time.sleep(2)
        else:
            raise RuntimeError("Database node initialization failed after 5 attempts.") from e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()