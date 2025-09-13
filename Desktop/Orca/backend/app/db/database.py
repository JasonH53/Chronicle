from typing import Generator
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.pool import StaticPool
from ..core.config import settings

# Database URL from settings
DATABASE_URL = settings.database_url

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Type alias for database session
DatabaseSession = Session


def create_db_and_tables() -> None:
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_db_session() -> Generator[DatabaseSession, None, None]:
    """Dependency to get database session."""
    with DatabaseSession(engine) as session:
        yield session
