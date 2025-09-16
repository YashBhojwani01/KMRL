import { useState } from "react";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
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

const sampleMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm your KMRL Document Intelligence Assistant. I can help you find information about safety protocols, maintenance records, compliance reports, and more. What would you like to know?",
    timestamp: "10:30 AM"
  }
];

const quickQuestions = [
  "Show me today's safety bulletins",
  "Any pending vendor payments?",
  "Latest maintenance schedules",
  "Compliance status overview"
];

export const FloatingAIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
          content: "I'm processing your request and searching through the document repository. Let me find the most relevant information for you.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-accent-foreground" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <div className="p-1 bg-accent/10 rounded-full">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <span className="text-base">AI Assistant</span>
                <Badge variant="secondary" className="ml-2">
                  Online
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col space-y-4 p-4">
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
                  onClick={() => handleQuickQuestion(question)}
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
                placeholder="Ask about documents, compliance, or operations..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
