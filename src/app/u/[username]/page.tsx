'use client'
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { POST } from '@/app/api/accept-messages/route';
import { ApiResponse } from '@/types/ApiResponse';
import { useState } from 'react';
import { toast } from 'sonner';
import messages from '@/messages.json'
import { Card, CardContent } from '@/components/ui/card';
function SendMessage() {
  const messageInputSchema = z.object({
    message: z.string().min(20, "Message must be at least 20 characters"),
  })
  const { username } = useParams<{ username: string }>();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(true);
  const form = useForm<z.infer<typeof messageInputSchema>>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: {
      message: '',
    },
  });

  const onMessageSubmit = async (data: z.infer<typeof messageInputSchema>) => {
    try {
      const response = await axios.post('/api/send-message', { username, content: data.message });
      toast(response?.data.message, { description: "Message Sent Successfully" })
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data.isAcceptingMessages === false) {
        setIsAcceptingMessage(false);
        toast(axiosError.response?.data.message, { description: "User not accpeting messages" })
      }
      toast(axiosError.response?.data.message, { description: "Failed to send message" })
    }
  }

  const handleMessageClick = (message: string) => {
    form.setValue('message', message);
  }

  const getMessageSuggestions = async () => {
    try {
      const response = await axios.post('/api/suggest-messages');
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className='h-screen bg-slate-700'>
      <div className="bg-slate-500">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onMessageSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${!isAcceptingMessage ? 'text-red-500' : ''}`}>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your message here..." disabled={!isAcceptingMessage} className={`${!isAcceptingMessage ? 'border-red-500' : ''}`} id="message" {...field} />
                  </FormControl>
                  {
                    !isAcceptingMessage && (
                      <p className='text-red-500'>User Not Accepting Messages</p>
                    )
                  }
                  <FormMessage />
                </FormItem>
              )}

            />
            <Button type="submit" disabled={!isAcceptingMessage}>Send message</Button>
          </form>
        </Form>
      </div>

      <div>
        <h2>
          Try some messages
        </h2>
        <Button onClick={getMessageSuggestions}>Suggest Messages</Button>
        {
          messages.map((message, index) => (
            <div key={index}>
              <Card className='hover:cursor-pointer' onClick={() => handleMessageClick(message.content)}>
                <CardContent className="flex items-center justify-center px-6 py-4 max-h-[20px] text-center ">
                  <p className="text-lg text-blue-500 leading-relaxed">
                    {message.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        }
      </div>
    </div >
  )
}

export default SendMessage