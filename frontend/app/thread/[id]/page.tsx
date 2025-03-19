"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMessages, sendMessage, fetchUser } from "../../utils/api";
import { Message } from "../../utils/types";

export default function ThreadChat({ params }: { params: { id: string } }) {
  const threadId = Number(params.id);
  const [userId, setUserId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUser();
      setUserId(user.id);
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (threadId) {
      fetchMessages(threadId).then(setMessages);
    }
  }, [threadId]);

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const response = await sendMessage(threadId, userId, input);
    console.log(response);
    setMessages([...messages, response.user, response.bot]);
    setInput("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat Thread {threadId}</h1>

      <div className="border p-4 h-96 overflow-y-scroll bg-gray-100 rounded-md">
        {messages.map((msg) => (
          <p key={msg.id} className={`p-2 ${msg.sender === "bot" ? "text-blue-500" : "text-black"}`}>
            <strong>{msg.sender === "bot" ? "Bot" : "You"}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />
        <button onClick={handleSendMessage} className="bg-green-500 text-white px-4 py-2 rounded ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
