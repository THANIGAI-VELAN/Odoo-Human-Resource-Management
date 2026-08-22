from sqlmodel import SQLModel, Field
from typing import Optional

class Holiday(SQLModel, table=True):
    date: str = Field(primary_key=True, index=True) # format YYYY-MM-DD
    name: str
