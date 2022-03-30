from pydantic import BaseModel
from typing import List, Optional
from fastapi_users import models
from fastapi_users.authentication.strategy.db import BaseAccessToken


class ItemBase(BaseModel):
    title: str


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int

    class Config:
        orm_mode = True


class ItemWithOwners(Item):
    owners: Optional[List['User']] = []


class User(models.BaseUser):

    class Config:
        orm_mode = True


class UserWithItems(User):
    items: Optional[List['Item']] = []


class UserCreate(models.BaseUserCreate):
    pass


class UserUpdate(models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass


class AccessToken(BaseAccessToken):
    pass


UserWithItems.update_forward_refs()
ItemWithOwners.update_forward_refs()
