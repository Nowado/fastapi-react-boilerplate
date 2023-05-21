from fastapi import Depends
from typing import AsyncGenerator, List
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from fastapi_users_db_sqlalchemy.access_token import (
    SQLAlchemyAccessTokenDatabase,
    SQLAlchemyBaseAccessTokenTableUUID,
)
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Mapped, DeclarativeBase
from sqlalchemy import Column, ForeignKey, Table, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.sql import func
import os

DATABASE_URL_ASYNC = "postgresql+asyncpg://" + os.environ['DATABASE_USER'] + ":" + os.environ['DATABASE_PASSWORD'] +\
               "@db:" + os.environ['DATABASE_PORT'] + "/" + os.environ['DATABASE_DB']

engine = create_async_engine(DATABASE_URL_ASYNC)

SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass


ItemOwner = Table('itemowner',
                  Base.metadata,
                  Column('itemId', Integer, ForeignKey('items.id'), primary_key=True),
                  Column('userId', UUID(as_uuid=True), ForeignKey('user.id'), primary_key=True),
                  Column('time_created', DateTime(timezone=True), server_default=func.now()),
                  Column('time_updated', DateTime(timezone=True), onupdate=func.now()),
                  )


ItemAccess = Table('itemaccess',
                   Base.metadata,
                   Column('itemId', Integer, ForeignKey('items.id'), primary_key=True),
                   Column('userId', UUID(as_uuid=True), ForeignKey('user.id'), primary_key=True),
                   Column('time_created', DateTime(timezone=True), server_default=func.now()),
                   Column('time_updated', DateTime(timezone=True), onupdate=func.now()),
                   )


class ItemTable(Base):
    __tablename__ = "items"
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    text: Mapped[str] = Column(Text, nullable=False)
    owners: Mapped[List['User']] = relationship("User", secondary=ItemOwner, back_populates="items_owned", lazy='selectin')
    access_granted: Mapped[List['User']] = relationship("User", secondary=ItemAccess, back_populates="items_available", lazy='selectin')


class User(SQLAlchemyBaseUserTableUUID, Base):
    items_owned: Mapped[List[ItemTable]] = relationship("ItemTable", secondary=ItemOwner, back_populates="owners", lazy='selectin')
    items_available: Mapped[List[ItemTable]] = relationship("ItemTable", secondary=ItemAccess, back_populates="access_granted", lazy='selectin')


class AccessToken(SQLAlchemyBaseAccessTokenTableUUID, Base):
    pass


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


async def get_access_token_db(session: AsyncSession = Depends(get_async_session),):
    yield SQLAlchemyAccessTokenDatabase(session, AccessToken)