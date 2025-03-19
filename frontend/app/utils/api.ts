import { Thread, Message } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUser() {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}

export async function fetchThreads(userId: number): Promise<Thread[]> {
    const res = await fetch(`${API_BASE_URL}/threads/${userId}`);
    return await res.json();
}

export async function createThread(userId: number, title: string): Promise<Thread> {
    const res = await fetch(`${API_BASE_URL}/threads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, title })
    });
    return res.json();
}

export async function fetchMessages(threadId: number): Promise<Message[]> {
    const res = await fetch(`${API_BASE_URL}/messages/${threadId}`);
    return res.json();
}

export async function sendMessage(threadId: number, userId: number, content: string): Promise<{ user: Message; bot: Message }> {
    const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: threadId, user_id: userId, content })
    });
    return res.json();
}