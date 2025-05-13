'use client'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { X } from 'lucide-react'
import { Message } from "@/model/User"
import axios from "axios"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (_messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast.success(response.data.message);
            onMessageDelete(message._id as string);
        } catch (err: any) {
            toast.error("Failed to delete message.");
        }
    };

    return (
        <Card className="w-full max-w-md bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500"></div>

            <CardHeader className="p-6 relative">
                <div className="absolute top-3 right-3">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-indigo-200 hover:text-red-400 hover:bg-indigo-800/50 rounded-full h-8 w-8 p-0">
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-indigo-950 border border-indigo-800 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-yellow-400">Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-indigo-200">
                                    This message will be permanently deleted. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-indigo-800 text-white hover:bg-indigo-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="bg-indigo-800/30 p-5 rounded-xl border border-indigo-700/50 w-full mt-2">
                    <CardDescription className="text-indigo-100 whitespace-pre-wrap break-words text-base leading-relaxed">
                        {message.content}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
}

export default MessageCard;
