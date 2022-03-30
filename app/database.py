from fastapi import Depends
from typing import AsyncGenerator
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from fastapi_users_db_sqlalchemy.access_token import (
    SQLAlchemyAccessTokenDatabase,
    SQLAlchemyBaseAccessTokenTable,
)
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, ForeignKey, Table, String
from sqlalchemy.dialects.postgresql import UUID
from .models import AccessToken, UserDB
import os

DATABASE_URL_ASYNC = "postgresql+asyncpg://" + os.environ['POSTGRES_USER'] + ":" + os.environ['POSTGRES_PASSWORD'] +\
               "@db:" + os.environ['POSTGRES_PORT'] + "/" + os.environ['POSTGRES_DB']

engine = create_async_engine(DATABASE_URL_ASYNC)

SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


ItemOwner = Table('itemowner',
                  Base.metadata,
                  Column('itemId', Integer, ForeignKey('items.id'), primary_key=True),
                  Column('userId', UUID(as_uuid=True), ForeignKey('user.id'), primary_key=True)
                  )


class ItemTable(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    owners = relationship("UserTable", secondary=ItemOwner, back_populates="items", lazy='selectin')


class UserTable(Base, SQLAlchemyBaseUserTable):
    items = relationship("ItemTable", secondary=ItemOwner, back_populates="owners", lazy='selectin')


class AccessTokenTable(SQLAlchemyBaseAccessTokenTable, Base):
    pass


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(UserDB, session, UserTable)


async def get_access_token_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyAccessTokenDatabase(AccessToken, session, AccessTokenTable)