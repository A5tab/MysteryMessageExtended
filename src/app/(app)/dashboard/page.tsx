'use client'

import MessageCard from "@/components/myComp/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message, {
        description: "Failed to get user status to accept messages"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast("Message Refreshed", {
          description: "Showing Latest Messages"
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message, {
        description: "Failed to fetch messages."
      });
    } finally {
      setIsSwitchLoading(false);
      setLoading(false);
    }
  }, [setIsSwitchLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message, {
        description: "Failed to update message acceptance status"
      });
    }
  }

  if (!session || !session.user) {
    return (
      <div></div>
    );
  }

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL copied!!!");
  }
  if (loading) {
    return (
      <p className="bg-amber-600 text-center text-3xl font-bold">Loading</p>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 py-8 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Copy Your Unique Link</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 px-4 py-3 rounded-l-xl bg-white/5 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 hover:bg-white/10 transition-colors duration-300"
              />
              <Button
                onClick={copyToClipboard}
                className="px-4 py-3 rounded-r-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white transition-all duration-300"
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 my-6"></div>

          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />
              <span className="ml-3 text-lg text-gray-200">
                Accept Messages: <span className={acceptMessages ? "text-green-400" : "text-red-400"}>
                  {acceptMessages ? 'On' : 'Off'}
                </span>
              </span>
            </div>
          </div>

          <div className="min-h-[300px] w-full px-4 py-8 sm:px-6 lg:px-12 flex justify-center items-start">
            {messages.length === 0 ? (
              <div className="text-center text-white space-y-3 max-w-md mx-auto">
                <p className="text-2xl sm:text-3xl font-semibold">No messages yet 📨</p>
                <p className="text-gray-300 text-base sm:text-lg">
                  Share your profile link to start receiving anonymous messages!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-7xl mx-auto">
                {messages.map((message) => (
                  <MessageCard
                    key={message._id as string}
                    message={message}
                    onMessageDelete={() => handleDeleteMessage(message._id as string)}
                  />
                ))}
              </div>
            )}
          </div>



        </div>
      </div>
    </div>

  );
}

export default Dashboard;
