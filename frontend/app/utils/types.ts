export type User = {
    id: string;
    name: string;
  };
  

export type Thread = {
    id: number;
    user_id: number;
    title: string;
}

export type Message = {
    id: number;
    user_id: number;
    thread_id: number;
    sender: "user" | "bot";
    content: string;
}