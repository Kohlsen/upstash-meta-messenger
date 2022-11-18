import { Message } from "../typings";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { unstable_getServerSession } from 'next-auth/next';

async function HomePage() {
    const data = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/getMessages`).then((res) => res.json());
    console.log(data);

    const messages: Message[] = data.messages;
    const session = await unstable_getServerSession();

  return (
    <main>
      <MessageList initialMessages={messages} session={session} />
      <ChatInput session={session} />
    </main>
  );
}

export default HomePage;
