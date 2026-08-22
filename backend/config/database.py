from sqlmodel import SQLModel, create_engine, Session
from .settings import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    # Helper to generate database schemas directly first
    SQLModel.metadata.create_all(engine)
