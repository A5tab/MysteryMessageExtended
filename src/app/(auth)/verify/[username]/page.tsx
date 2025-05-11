'use client'

import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from "sonner"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(
            verifySchema
        ),
        defaultValues: {
            code: '',

        }
    })
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const reponse = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code,
            })

            toast("Success", reponse.data.message);

            router.replace('/signin');
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            if (axiosError.response?.status === 400) {
                toast('Verification Failed', {
                    description: errorMessage,
                    style: {
                        border: '1px solid orange',
                        padding: '16px',
                        color: 'orange'
                    }
                })
                router.replace('/signup');
            }
            toast('Signup Failed', {
                description: errorMessage,
                style: {
                    border: '1px solid red',
                    padding: '16px',
                    color: 'red'
                }
            })
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 flex justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
                <div className="text-center">
                    <h1 className="bg-gradient-to-br bg-clip-text text-transparent from-gray-400 via-purple-400 to-indigo-300 leading-[1.40] text-4xl font-extrabold lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-6 text-gray-300">Enter the verification code sent to your email</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Verification code"
                                                {...field}
                                                className="bg-white/5 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 rounded-xl hover:bg-white/10 transition-colors duration-300"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2.5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>

    )
}

export default VerifyAccount