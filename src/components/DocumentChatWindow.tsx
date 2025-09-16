import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface DocumentChatWindowProps {
  documentTitle?: string;
}

export const DocumentChatWindow = ({ documentTitle }: DocumentChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `I've analyzed your uploaded document${documentTitle ? ` "${documentTitle}"` : ''}. I can answer questions about its content, extract specific information, summarize sections, or help you understand compliance requirements. What would you like to know?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Based on your uploaded document, I can provide specific insights. Please note that this is a demo - connect your LLM here to get real-time answers about your document content.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const quickQuestions = [
    "What are the key points?",
    "Are there any deadlines?",
    "Who is responsible?",
    "What actions are required?"
  ];

  return (
    <Card className="h-96">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2">
          <div className="p-1 bg-accent/10 rounded-full">
            <Bot className="h-4 w-4 text-accent" />
          </div>
          <span className="text-base">Document Chat Assistant</span>
          <Badge variant="secondary" className="ml-2">
            Ready for LLM Integration
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 h-80 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.type === "user"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "assistant" && (
                    <Bot className="h-3 w-3 mt-0.5 text-accent flex-shrink-0" />
                  )}
                  {message.type === "user" && (
                    <User className="h-3 w-3 mt-0.5 text-accent-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.type === "user" ? "text-accent-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className="flex flex-wrap gap-1">
          {quickQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              size="sm"
              onClick={() => setNewMessage(question)}
              className="text-xs h-6"
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask questions about the uploaded document..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
