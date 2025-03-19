"use client";

import { useState, useEffect } from "react";
import { fetchThreads, createThread } from "../utils/api";
import { Thread } from "../utils/types";

export default function ThreadsList({ userId, initialThreads }: { userId: number; initialThreads: Thread[] }) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [newThreadName, setNewThreadName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      const latestThreads = await fetchThreads(userId);
      setThreads(latestThreads);
      setLoading(false);
    };

    loadThreads();
  }, [userId]);

  const handleCreateThread = async () => {
    if (!newThreadName.trim()) return;

    setLoading(true);

    const newThread: Thread = await createThread(userId, newThreadName);
    setNewThreadName("");

    setThreads((prevThreads) => [...prevThreads, newThread]);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chat Threads</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter new thread title..."
          value={newThreadName}
          onChange={(e) => setNewThreadName(e.target.value)}
          className="w-full p-2 border rounded-md text-black focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleCreateThread}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-black">Title</th>
              <th className="p-3 text-right text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
                  Loading threads...
                </td>
              </tr>
            ) : threads.length > 0 ? (
              threads.map((thread, index) => (
                <tr key={thread.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 text-black">{thread.title}</td>
                  <td className="p-3 text-right">
                    <a href={`/thread/${thread.id}`} className="text-blue-600 hover:underline">
                      View →
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
                  No threads yet. Create one now!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
