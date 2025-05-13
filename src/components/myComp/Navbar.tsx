'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

function Navbar() {
    const { data: session } = useSession()
    const user: User = session?.user as User;

    return (
        <nav className="w-full shadow-lg">
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 md:px-8 container mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                <Link href="/"
                    className="text-3xl font-bold relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 pb-1 inline-block">
                        Mystery Message
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <div className="bg-indigo-800/50 px-4 py-2 rounded-full text-yellow-100 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span className="truncate max-w-[150px]">{user?.username || user.email}</span>
                            </div>
                            <Button
                                onClick={() => signOut()}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link
                            href={'/signin'}
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-indigo-900 font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 text-lg"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
