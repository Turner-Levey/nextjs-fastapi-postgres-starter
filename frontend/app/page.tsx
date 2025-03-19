import { fetchThreads } from './utils/api';
import Image from "next/image";
import { Thread, User } from "./utils/types"
import ThreadsList from './componenet/ThreadsList';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function Home() {
  const user: User = await fetch(`${apiUrl}/users/me`).then((res) =>
    res.json()
  );

  const threads: Thread[] = await fetchThreads(Number(user.id));

  return (
    <main className="flex flex-col items-center p12">
      <h1 className='text-2xl font-bold mb-4 mt-10'>Hello, {user?.name}!</h1>
      
      <ThreadsList userId={Number(user.id)} initialThreads={threads}></ThreadsList>
    </main>
  );
}
