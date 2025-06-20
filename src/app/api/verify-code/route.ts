import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request: Request) {
    await dbConnect();


    try {
        const { username, code } = await request.json();
        const result = verifySchema.safeParse({ code });
        
        if (!result.success) {
            return Response.json({
                success: false,
                message: 'Invalid Code Format'
            }, {
                status: 400
            })
        }
        
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification Code has expires plz signup again to get a new code"
            }, { status: 400 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification Code"
            }, { status: 400 })
        }

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}