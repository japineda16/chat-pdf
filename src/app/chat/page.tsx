"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "ai/react";
import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";

const Chat: React.FC = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="bg-gray-50">
      <div className="container">
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto my-5">
            {messages.map((message, index) => (
              <Card
                key={message.id}
                className={`py-3 my-3 w-[90%] ${
                  message.role == "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <CardContent>
                  <p className="font-semibold">
                    {message.role == "user" ? "Usted: " : "Jarvis: "}
                  </p>
                  <Markdown>{message.content}</Markdown>
                </CardContent>
              </Card>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center h-28 bg-gray-50 border-t-2"
            >
              <input
                value={input}
                onChange={handleInputChange}
                type="text"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Escribe un mensaje..."
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 text-white bg-indigo-500 rounded-md shadow-md"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
