import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react";
import { Send } from "lucide-react";

interface CommunicationProps {
  userRole: "employee" | "manager" | "director";
  language: "en" | "ml";
}

interface Message {
  id: string;
  sender: string;
  role: string;
  timestamp: string;
  content: string;
  priority: string;
  department: string;
  replies: number;
  tags: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Priya Sharma",
    role: "employee",
    timestamp: "2 hours ago",
    content: "We need approval from Finance department for the additional environmental monitoring equipment.",
    priority: "High",
    department: "Environmental",
    replies: 8,
    tags: ["Finance", "Safety"],
  },
  {
    id: "2",
    sender: "Anjali Nair",
    role: "employee",
    timestamp: "5 hours ago",
    content: "Safety department has requested additional time for the emergency response training module.",
    priority: "Medium",
    department: "HR",
    replies: 12,
    tags: ["Safety", "Operations"],
  },
];

export const CrossDepartmentCommunication = ({ userRole, language }: CommunicationProps) => {
  const isMalayalam = language === "ml";

  const localizedContent = {
    newMessage: isMalayalam ? "പുതിയ സന്ദേശം" : "New Message",
    to: isMalayalam ? "To" : "To",
    subject: isMalayalam ? "Subject" : "Subject",
    message: isMalayalam ? "Message" : "Message",
    send: isMalayalam ? "Send" : "Send",
    communicationLog: isMalayalam ? "Communication Log" : "Communication Log",
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Cross-Department Communication</h1>
        <p className="text-gray-500">Collaborate across departments</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discussion" className="p-4">
        <TabsList>
          <TabsTrigger value="discussion">Discussion Threads</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="discussion" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-1/2">
              <Input type="search" placeholder="Search threads..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <Button>+ New Thread</Button>
          </div>
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <div className="p-4">
              {mockMessages.map((message) => (
                <Card key={message.id} className="mb-4">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarFallback>{message.sender ? message.sender.substring(0, 2).toUpperCase() : ''}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="ml-2">{message.sender}</CardTitle>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge>{message.department}</Badge>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <p className="text-sm text-gray-500">{message.timestamp} • {message.replies} replies</p>
                    </div>
                    <CardDescription>{message.priority}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{message.content}</p>
                    <div className="mt-2 flex flex-wrap">
                      {message.tags.map((tag, index) => (
                        <Badge key={index} className="mr-1">{`@${tag}`}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>EM</AvatarFallback>
                    </Avatar>
                    <Input type="text" placeholder="Add Comment" className="ml-2" />
                    <Button variant="ghost" className="ml-2 p-2">
                      <Send className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="announcements" className="mt-4">
          <div>Announcements Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
