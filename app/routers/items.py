from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ..database import ItemTable, User,  get_async_session
from .users import current_active_user
from ..models import ItemCreate, Item, ItemOwned
from sqlalchemy.future import select
from typing import Optional

router = APIRouter()


@router.post(
    "/",
    response_model=Item)
async def post_item(
        item: ItemCreate, db: Session = Depends(get_async_session), user: User = Depends(current_active_user),
):
    db_item = ItemTable(**item.dict())
    db.add(db_item)
    user.items_owned.append(db_item)
    user.items_available.append(db_item)
    db.add(user)
    await db.commit()
    return db_item


@router.get(
    "/",
    response_model=List[Item])
async def get_items(
        item_id: Optional[int] = None,
        count: Optional[int] = 5,
        db: Session = Depends(get_async_session), user: User = Depends(current_active_user),
):
    items = []
    itemtable = None
    if item_id:
        itemtable = await db.execute(select(ItemTable).filter(ItemTable.id == item_id).order_by(ItemTable.time_created))
        # print(itemtable)
    else:
        itemtable = await db.execute(select(ItemTable))

    for item in itemtable:
        # print(item, type(item))
        item = item.ItemTable
        items.append(item)

    access_filtered_items = []
    for item in items:  # Check if accessible
        # print(item, type(item))
        # print(item.access_granted, type(item.access_granted))
        if user in item.access_granted:
            access_filtered_items.append(item)
    if len(access_filtered_items) < 1:  # Probably better to return example of List[Item] at some point
        raise HTTPException(status_code=404, detail="Item not found")
    return access_filtered_items[:count]


@router.put(
    "/",
    response_model=List[Item])
async def update_items(
        items_in: List[Item], db: Session = Depends(get_async_session), user: User = Depends(current_active_user),
):
    items_out = []
    items = []
    itemtable = None
    if items_in:
        items_id = []
        for item in items_in:
            items_id.append(item.id)
        itemtable = await db.execute(select(ItemTable).filter(ItemTable.id.in_(items_id)))
    else:
        itemtable = await db.execute(select(ItemTable))

    for item in itemtable:  # Get Items from generator
        item = item.ItemTable
        items.append(item)

    access_filtered_items = []
    for item in items:  # Check if accessible
        if user in item.access_granted:
            access_filtered_items.append(item)
    for item in access_filtered_items:  # Perform update
        for item_in in items_in:
            if item_in.id == item.id:
                await db.execute(update(ItemTable).where(ItemTable.id == item_in.id).values(text=item_in.text))  # for whatever god forsaken reason, when inheriting from ItemTable you still need to use ItemTable and not child class name here
                items_out.append(ItemTable(**item_in.dict()))
    return items_out

@router.delete(
    "/",
    response_model=List[Item])
async def delete_items(
        items_in: List[Item], db: Session = Depends(get_async_session), user: User = Depends(current_active_user),
):
    items_out = []
    items = []
    itemtable = None
    if items_in:
        items_id = []
        for item in items_in:
            items_id.append(item.id)
        itemtable = await db.execute(select(ItemTable).filter(ItemTable.id.in_(items_id)))
    else:
        itemtable = await db.execute(select(ItemTable))

    for item in itemtable:  # Get Items from generator
        item = item.ItemTable
        items.append(item)

    access_filtered_items = []
    for item in items:  # Check if accessible
        if user in item.access_granted:
            access_filtered_items.append(item)

    for item in access_filtered_items:  # Exceptionally dumb way to do it. Fix by abstracting it from all endpoints
        for item_in in items_in:
            if item_in.id == item.id:
                await db.delete(item)
                user.items_owned.remove(item)
                user.items_available.remove(item)
                await db.commit()
                items_out.append(item)

    return items_out
