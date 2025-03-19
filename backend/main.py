from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from seed import seed_user_if_needed
from sqlalchemy.ext.asyncio import AsyncSession
from db_engine import engine
from models import User, Thread, Message
import random

seed_user_if_needed()

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

RESPONSES = ["Hi there!", "That sounds interesting...", "I am here to help.", "How can I improve my functionality?", "I am your friendly chat bot assistant."]


class UserRead(BaseModel):
    id: int
    name: str

class ThreadCreate(BaseModel):
    user_id: int
    title: str

class ThreadRead(BaseModel):
    id: int
    user_id: int
    title: str

class MessageCreate(BaseModel):
    user_id: int
    thread_id: int
    content: str

class MessageRead(BaseModel):
    id: int
    user_id: int
    thread_id: int
    sender: str
    content: str

@app.get("/users/me")
async def get_my_user():
    async with AsyncSession(engine) as session:
        async with session.begin():
            # Sample logic to simplify getting the current user. There's only one user.
            result = await session.execute(select(User))
            user = result.scalars().first()

            if user is None:
                raise HTTPException(status_code=404, detail="User not found")
            return UserRead(id=user.id, name=user.name)
        

@app.post("/threads")
async def create_thread(thread: ThreadCreate):
    async with AsyncSession(engine) as session:
        async with session.begin():
            new_thread = Thread(user_id=thread.user_id, title=thread.title)
            session.add(new_thread)
            await session.flush()
            await session.commit()
        
        await session.refresh(new_thread)
        
        return ThreadRead(id=new_thread.id, user_id=new_thread.user_id, title=new_thread.title)
    

@app.get("/threads/{user_id}")
async def get_threads(user_id: int):
    async with AsyncSession(engine) as session:
        async with session.begin():
            result = await session.execute(select(Thread).where(Thread.user_id == user_id))
            print(result)
            threads = result.scalars().all()
            
            return [ThreadRead(id=thread.id, user_id=thread.user_id, title=thread.title) for thread in threads]
        

@app.get("/messages/{thread_id}")
async def get_messages(thread_id: int):
    async with AsyncSession(engine) as session:
        async with session.begin():
            result = await session.execute(select(Message).where(Message.thread_id == thread_id))
            messages = result.scalars().all()

            if not messages: 
                return []

            return [MessageRead(id=msg.id, user_id=msg.user_id, thread_id=msg.thread_id, sender=msg.sender, content=msg.content) for msg in messages]

@app.post("/messages")
async def send_message(message: MessageCreate):
    async with AsyncSession(engine) as session:
        async with session.begin():
            user_message = Message(user_id=message.user_id, thread_id=message.thread_id, content=message.content, sender="user")
            session.add(user_message)
            await session.flush()

            bot_response = random.choice(RESPONSES)
            bot_message = Message(user_id=message.user_id, thread_id=message.thread_id, content=bot_response, sender="bot")
            session.add(bot_message)
            await session.flush()
            await session.commit()

        await session.refresh(user_message)
        await session.refresh(bot_message)
        return {
            "user": MessageRead(id=user_message.id, user_id=user_message.user_id, thread_id=user_message.thread_id, sender=user_message.sender, content=user_message.content),
            "bot": MessageRead(id=bot_message.id, user_id=bot_message.user_id, thread_id=bot_message.thread_id, sender=bot_message.sender, content=bot_message.content)
        }