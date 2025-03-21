import { ChatbotSidebar } from '@/components/chatbot-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import Neo4jGraph from './knowledge-graph/page';


export default function Home() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <Neo4jGraph />
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="absolute top-4 right-4">
            <MessageSquare className="mr-2 h-5 w-5" />
            Chatbot
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <ChatbotSidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
