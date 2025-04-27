'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User;

    return (
        <nav className="dark:bg-gray-900">
            <div className="bg-gradient-to-br from-green-700 via-slate-500 to-slate-700 md:px-8 container mx-auto px-6 py-3 flex justify-between">
                <Link href="/"
                    className="text-3xl font-bold bg-gradient-to-br from-gray-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent dark:text-gray-200">
                    Mystery Message
                </Link>
                {
                    session ? (<>
                        <span className="text-gray-200 dark:text-gray-200">{user?.username || user.email}</span>
                        <Button onClick={() => signOut()} className="ml-4 bg-amber-600">
                            Logout
                        </Button>
                    </>
                    ) : (<Link href={'/signin'} className="text-white dark:text-gray-200 bg-gradient-to-br from-gray-400 via-purple-400 to-indigo-300 rounded-xl p-3 text-xl"> Login</Link>)
                }
            </div>
        </nav >
    )
}

export default Navbar
