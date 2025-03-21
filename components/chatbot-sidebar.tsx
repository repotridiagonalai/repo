'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import typingGif from '@/assets/aiveee.jpg';
import chatIcon from '@/assets/aiveee.jpg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const predefinedResponses: { [key: string]: string } = {
  'hello': 'Hi there! How can I assist you today?',
  'help': 'Sure! Let me know what you need help with.',
  'features': 'Our chatbot can assist you with inquiries, provide information, and much more.',
  'pricing': 'Our pricing plans vary based on features. Would you like more details?',
};

export function ChatbotSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const botResponse = predefinedResponses[input.toLowerCase()] || 'This is a demo response. The AI integration will be implemented later.';
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-lg font-semibold">Aivee Chat Assistant</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <Image src={typingGif} alt="Typing..." width={50} height={30} />
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Image src={chatIcon} alt="Send" width={24} height={24} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
