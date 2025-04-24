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
            <div className="container mx-auto px-6 py-3 flex justify-between border border-b-4 border-gray-400">
                <Link href="/"
                    className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Mystery Message
                </Link>
                {
                    session ? (<>
                        <span className="text-gray-200 dark:text-gray-200">{user?.username || user.email}</span>
                        <Button onClick={() => signOut()} className="ml-4 bg-amber-600">
                            Logout
                        </Button>
                    </>
                    ) : (<Link href={'/signin'} className="text-white dark:text-gray-200 bg-amber-600 rounded-xl p-3 text-xl"> Login</Link>)
                }
            </div>
        </nav >
    )
}

export default Navbar
