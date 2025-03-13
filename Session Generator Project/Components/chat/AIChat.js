import React, { useState, useRef, useEffect } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Artist } from "@/entities/Artist";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Send, User, Music, Bot, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ChatMessage = ({ message, artists }) => {
  const isUser = message.sender === "user";

  if (message.sender === "system") {
    return (
      <div className="my-4 px-4 py-2 text-center">
        <p className="text-sm text-gray-500">{message.text}</p>
      </div>
    );
  }

  if (message.sender === "recommendation" && message.artists) {
    return (
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex items-start">
          <Avatar className="h-8 w-8 bg-purple-100 text-purple-600 mr-3">
            <Bot className="h-5 w-5" />
          </Avatar>
          <div className="max-w-[80%]">
            <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
              <p className="text-gray-800">{message.text}</p>
            </div>
          </div>
        </div>
        
        <div className="ml-11 mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
          {message.artists.map((artistId) => {
            const artist = artists.find(a => a.id === artistId);
            if (!artist) return null;
            
            return (
              <div key={artist.id} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{artist.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Music className="w-3 h-3 mr-1" />
                      <span>{artist.primary_genre || artist.genres?.[0] || "Various"}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/ArtistProfile/${artist.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {artist.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start mb-4 ${isUser ? "justify-end" : ""}`}>
      <Avatar className={`h-8 w-8 ${isUser ? "order-2 bg-blue-100 text-blue-600 ml-3" : "mr-3 bg-purple-100 text-purple-600"}`}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Avatar>
      <div className={`max-w-[80%] ${isUser ? "order-1" : ""}`}>
        <div className={`p-4 shadow-sm rounded-2xl ${isUser ? "bg-blue-50 rounded-tr-none" : "bg-white rounded-tl-none"}`}>
          <p className="text-gray-800">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default function AIChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Start a new conversation" },
    { id: 2, sender: "assistant", text: "Hi there! I can help you find the perfect music collaborator based on your needs. Tell me what you're looking for - like 'I need a pop producer in LA who works with guitar-driven tracks' or 'Looking for a songwriter in Nashville for a country album'" }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [artists, setArtists] = useState([]);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    loadArtists();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadArtists = async () => {
    try {
      const data = await Artist.list();
      // Remove duplicates by name
      const uniqueArtists = data.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          // If we find a duplicate, keep the one with more information
          const currentInfoCount = Object.keys(current).filter(key => current[key]).length;
          const existingInfoCount = Object.keys(x).filter(key => x[key]).length;
          if (currentInfoCount > existingInfoCount) {
            return acc.map(item => item.name === current.name ? current : item);
          }
          return acc;
        }
      }, []);
      
      setArtists(uniqueArtists);
    } catch (error) {
      console.error("Error loading artists:", error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const newUserMessage = { id: messages.length + 1, sender: "user", text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      const artistsData = artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        location: artist.location,
        tier: artist.tier,
        genres: artist.genres,
        tags: artist.tags,
        primary_genre: artist.primary_genre
      }));
      
      const prompt = `
        User query: "${input}"
        
        As an AI assistant for a music industry collaboration matching app, analyze this query to help match the user with the most suitable artists/producers. 
        
        Consider these aspects of the query:
        1. Artist name (if specified)
        2. Location preferences
        3. Timeframe
        4. Genre/style preferences
        5. Specific skills needed (producer, songwriter, engineer, etc.)
        
        Based on this analysis, provide:
        1. A conversational response addressing the user's needs
        2. The IDs of 2-4 most relevant artists from our database
        
        Database artists: ${JSON.stringify(artistsData)}
      `;
      
      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            artist_ids: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 2, 
          sender: "recommendation", 
          text: response.response, 
          artists: response.artist_ids
        }
      ]);
    } catch (error) {
      console.error("Error processing request:", error);
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 2, 
          sender: "assistant", 
          text: "I'm sorry, I encountered an error processing your request. Could you try again with different wording?" 
        }
      ]);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} artists={artists} />
          ))}
          
          {isProcessing && (
            <div className="flex items-start mb-4">
              <Avatar className="h-8 w-8 mr-3 bg-purple-100 text-purple-600">
                <Bot className="h-5 w-5" />
              </Avatar>
              <div className="max-w-[80%]">
                <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <Card className="mx-4 mb-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center p-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I need a producer for a pop track in LA..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="ml-2 bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}