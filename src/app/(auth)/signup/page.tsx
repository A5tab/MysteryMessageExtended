'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod';
import Link from "next/link"
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react'
function Signup() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();

    // zod implememtation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(
            signUpSchema
        ),
        defaultValues: {
            username: '',
            email: '',
            password: ''

        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`)
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signup', data)
            toast("Success", {
                description: response.data.message,
            })
            router.replace(`/verify/${username}`);
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast('Signup Failed', {
                description: errorMessage,
            })
            setIsSubmitting(false);
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 flex justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
                <div className="text-center">
                    <h1 className="bg-gradient-to-br bg-clip-text text-transparent from-gray-400 via-purple-400 to-indigo-300 leading-[1.40] text-4xl font-extrabold lg:text-5xl mb-6">Join Mystery Message</h1>
                    <p className="mb-6 text-gray-300">Signup to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            className="bg-white/5 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 rounded-xl hover:bg-white/10 transition-colors duration-300"
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin text-purple-500 mt-2" />}
                                    <p className={`text-sm ${usernameMessage === "Username Available" ? 'text-green-500' : 'text-red-400'}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                            className="bg-white/5 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 rounded-xl hover:bg-white/10 transition-colors duration-300"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
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
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2.5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            {isSubmitting ? (<>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                            </>) : ('Signup')}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-6">
                    <Link href={'/signin'} className="text-gray-300 hover:text-white transition-colors duration-300">Already have an account. <span>Login here</span>.</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup;

