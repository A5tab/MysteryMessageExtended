import React from 'react'
import { Card, CardContent } from '../ui/card'

function SuggestiveMessageList({ messages, handleMessageClick, className = "" }: { messages: string[], handleMessageClick: (message: string) => void, className?: string }) {
    return (
        <>
            {
                messages.map((message, index) => {
                    return (
                        <div key={index}>
                            <Card className={`hover:cursor-pointer ${className}`} onClick={() => handleMessageClick(message)}>
                                <CardContent className="flex items-center justify-center px-6 py-4 max-h-[20px] message-center ">
                                    <p className="text-gray-800 leading-relaxed">
                                        {message}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}

        </>
    )
}

export default SuggestiveMessageList