
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to help you with any questions. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const generatePerplexityResponse = async (message: string, apiKey: string) => {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for an educational platform. Your responses should be accurate, concise, and focused on helping users learn.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generatePerplexityResponse(userMessage, apiKey);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please check your API key and try again.",
        variant: "destructive",
      });
      console.error('Error generating response:', error);
    }
    setIsLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90%] sm:w-[440px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Course Assistant
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {!apiKey && (
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Enter your Perplexity API key to enable the chatbot. You can get one from the Perplexity website.
              </p>
            </div>
          )}

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 mt-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading || !apiKey}
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim() || !apiKey}>
              Send
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;

