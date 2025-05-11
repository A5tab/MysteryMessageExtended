import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from 'next-auth';
import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            sucess: false,
            messageSchema: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, {
            isAcceptingMessages: acceptMessages
        }, { new: true }
        )
        if (!updatedUser) {
            return Response.json({ success: false, message: "Failed to update user status to accpet messages" }, { status: 401 })
        }

        return Response.json({ success: true, message: "Message acceptance status updated successfully", updatedUser }, { status: 200 })

    } catch (error) {
        console.log("failed to update user status to accpet messages", error);
        return Response.json({ success: false, message: "Failed to update user status to accpet messages" }, { status: 500 })

    }

}

export async function GET(_request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            sucess: false,
            messageSchema: "Not authenticated"
        }, { status: 401 })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        }

        return Response.json({ success: true, message: "User found", isAcceptingMessages: foundUser.isAcceptingMessage }, { status: 200 })
    } catch (error) {
        console.log("failed to get user status to accpet messages", error);
        return Response.json({ success: false, message: "Failed to get user status to accpet messages" }, { status: 500 })
    }
}
