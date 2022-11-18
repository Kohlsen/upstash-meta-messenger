'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { clientPusher } from '../pusher';
import { Message } from '../typings';
import fetcher from '../utils/fetchMessages';
import MessageComponent from './MessageComponent';
import { unstable_getServerSession } from 'next-auth/next';

type Props = {
    initialMessages: Message[];
    session: Awaited<ReturnType<typeof unstable_getServerSession>>
}
function MessageList({initialMessages, session}: Props) {
    const { data: messages, error, mutate } = useSWR<Message[]>('/api/getMessages', fetcher);

    useEffect(() => {
        const channel = clientPusher.subscribe('messages');

        channel.bind('new-message', async (data: Message) => {
            // if you sent the message no need to update cache
            if (messages?.find((message) => message.id === data.id)) return;

            console.log("-- NEW MESSAGE FROM PUSHER: ", data.message, '--');

            if (!messages) {
                mutate(fetcher);
            } else {
                mutate(fetcher, {
                    optimisticData: [data, ...messages!],
                    rollbackOnError: true,
                })
            }
         
        })
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [messages, mutate, clientPusher])

  return (
    <div className='space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto'>
        {(messages || initialMessages).map((message) => (
            <MessageComponent key={message.id} message={message} session={session}/>
        ))}
        
    </div>
  )
}

export default MessageList