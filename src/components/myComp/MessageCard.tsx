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
        <Card className="w-full max-w-md bg-neutral-900 border border-neutral-700 text-white shadow-md transition-all hover:shadow-lg rounded-2xl relative">
            <CardHeader className="p-5">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold truncate max-w-[85%]">
                        Anonymous Message
                    </CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-red-500">
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This message will be permanently deleted. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription className="text-gray-300 whitespace-pre-wrap break-words text-sm">
                    {message.content}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

export default MessageCard;
