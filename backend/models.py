from sqlalchemy import String, Column, Integer, ForeignKey, Text
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))

    threads = relationship("Thread", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}"

class Thread(Base):
    __tablename__ = "threads"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    title: Mapped[str] = mapped_column(String(100), nullable=False)

    user = relationship("User", back_populates="threads")
    messages = relationship("Message", back_populates="thread", cascade="all, delete")

    def __repr__(self) -> str:
        return f"Thread(id={self.id!r}, user_id={self.user_id!r}, title={self.title!r}"

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    thread_id: Mapped[int] = mapped_column(ForeignKey("threads.id"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    sender: Mapped[str] = mapped_column(String(10), nullable=False)

    user = relationship("User")
    thread = relationship("Thread", back_populates="messages")

    def __repr__(self) -> str:
        return f"Message(id={self.id!r}, user_id={self.user_id!r}, thread_id={self.thread_id!r}, sender={self.sender!r}, content={self.content!r}"