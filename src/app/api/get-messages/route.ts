import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            sucess: false,
            messageSchema: "Not authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id); // see in auth options conversion of id to string why?

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: '$messages'
            }, {
                $sort: { 'messages.createdAt': -1 }
            }, {
                $group: { _id: '$_id', messages: { $push: '$messages' } }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json({ success: true, message: "No messages yet", messages: [] }, { status: 200 })
        }


        return Response.json({
            success: true,
            message: "User found",
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("failed to get user status to accpet messages", error);
        return Response.json({ success: false, message: "Failed to get user status to accpet messages" }, { status: 500 })
    }
}
