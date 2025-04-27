'use client'
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ApiResponse } from '@/types/ApiResponse';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import messages from '@/messages.json'
import { useAIStreamingMessage } from '@/hooks/useAIStreamingMessage';
import SuggestiveMessageList from '@/components/myComp/SuggestiveMessageList';
import { Sparkles, Send, MessageSquare, Heart, Smile, Coffee, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
function SendMessage() {
  const messageInputSchema = z.object({
    message: z.string().min(20, "Message must be at least 20 characters"),
  })
  const { username } = useParams<{ username: string }>();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(true);
  const { aiMessages, aiThinking, getAiMessages, hasFetched } = useAIStreamingMessage();
  const [messageSent, setMessageSent] = useState(false);
  const suggestionsToShow = hasFetched
    ? aiMessages.trim().replace(/^["](.*)["]$/, '$1').split('||')
    : messages.map(m => m.content);
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
      setMessageSent(true);
      form.setValue('message', '');
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

  useEffect(() => {
    if (messageSent) {
      const timeout = setTimeout(() => {
        setMessageSent(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [messageSent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Anonymous Feedback
          </h1>
          <p className="text-gray-300">Share your thoughts without revealing your identity</p>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-purple-500 bg-gradient-to-br from-indigo-600 to-purple-600">
              <AvatarFallback className="text-xl font-bold text-violet-700">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">@{username}</h2>
              <div className="mt-1 flex items-center">
                <div
                  className={`mr-2 h-2 w-2 rounded-full ${isAcceptingMessage ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <p className="text-sm text-gray-300">
                  {isAcceptingMessage ? "Accepting messages" : "Not accepting messages"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onMessageSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-medium ${!isAcceptingMessage ? "text-red-400" : "text-gray-200"}`}
                    >
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Write your message here..."
                          disabled={!isAcceptingMessage}
                          className={`resize-y overflow-auto whitespace-pre-wrap 
                              break-words  min-h-[120px] rounded-xl border-0 bg-white/5 p-4 text-white placeholder:text-gray-600 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 hover:bg-white/10 transition-colors duration-300 ${!isAcceptingMessage ? "border-red-500 focus:ring-red-500" : ""}`}
                          id="message"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    {!isAcceptingMessage && (
                      <p className="text-red-400 text-sm">This user is not accepting messages at this time</p>
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={getAiMessages}
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-0 bg-white/10 text-white hover:bg-white/20"
                  disabled={aiThinking}
                >
                  {aiThinking ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Get Suggestions</span>
                    </>
                  )}
                </Button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageSent ? "success" : "submit"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={!isAcceptingMessage || messageSent}
                      className={`rounded-full px-6 text-white ${messageSent
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                        }`}
                    >
                      {messageSent ? (
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>Message Sent!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </AnimatePresence>

              </div>
            </form>
          </Form>
        </motion.div>

        {/* Suggestions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <MessageSquare className="h-5 w-5" />
              Message Ideas
            </h2>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>

          {suggestionsToShow.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border-0 p-8 text-center">
              <Smile className="mb-3 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-gray-300">Need inspiration for your message?</p>
              <p className="text-sm text-gray-400">Click "Get Suggestions" for some ideas</p>
            </div>
          ) : (
            <SuggestiveMessageList messages={suggestionsToShow} handleMessageClick={handleMessageClick} className="bg-white/5 backdrop-blur-sm border-0 my-2" />
          )}

          <div className="mt-6 flex items-center justify-center">
            <p className="flex items-center gap-2 text-sm text-purple-800">
              <Coffee className="h-4 w-4" />
              Powered by AI suggestions
            </p>
          </div>
        </motion.div>
      </div>
    </div>

  )
}

export default SendMessage