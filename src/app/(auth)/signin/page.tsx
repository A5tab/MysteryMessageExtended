'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod';
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react'
import { signIn } from "next-auth/react";
import Link from "next/link";

function page() {
  const router = useRouter();

  // zod implememtation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(
      signInSchema
    ),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      toast('Login Failed', {
        description: 'Incorrect Email or Password'
      })
    }

    if (result?.url) {
      router.replace('/dashboard')
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 flex justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl">
        <div className="text-center">
          <h1 className="bg-gradient-to-br bg-clip-text text-transparent from-gray-400 via-purple-400 to-indigo-300 leading-[1.40] text-4xl font-extrabold lg:text-5xl mb-6">Signin</h1>
          <p className="mb-6 text-gray-300">Login to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email/Username"
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
              className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2.5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  <span>Please Wait</span>
                </div>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <Link href={'/signup'} className="text-gray-300 hover:text-white transition-colors duration-300">Not Registered? <span>Create an Account</span>.</Link>
        </div>
      </div>
    </div>
  )
}
export default page
