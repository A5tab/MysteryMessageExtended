'use client';

import { Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import messages from '@/messages.json';
import AutoPlay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      <main className="min-h-dvh flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white mx-auto">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-[#00f7ff]">
            True Feedback — Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[AutoPlay({ delay: 2500 })]}
          className="w-full max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="bg-[#112d4e] border-none shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
                    <CardHeader>
                      <CardTitle className="text-[#00f7ff] text-center text-xl">
                        {message.title || `Anonymous`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center px-6 py-4 min-h-[150px] text-center">
                      <p className="text-lg text-white/90 leading-relaxed">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-amber-400 hover:text-[#00f7ff]" />
          <CarouselNext className="text-amber-400 hover:text-[#00f7ff]" />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-white text-grey-600 text-sm">
        © 2025 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
