"use client";
import { useState } from 'react';
import { useAI } from '@/context/AIContext';
import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
}

export default function AIChatWindow() {
  const { isAIOpen, toggleAI } = useAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);

      // Add user message to chat
      setMessages((prev) => [...prev, { role: 'user', content: input }]);

      // Log the request payload
      console.log('Sending request with payload:', {
        messages: [
          { role: 'system', content: 'You are a helpful assistant for merchant services agents.' },
          { role: 'user', content: input },
        ],
      });

      // Send request to the API route
      const { data } = await axios.post<{ response: string }>('/api/chat', {
        messages: [
          { role: 'system', content: 'You are a helpful assistant for merchant services agents.' },
          { role: 'user', content: input },
        ],
      });

      // Log the API response
      console.log('API response:', data);

      // Add AI response to chat
      setMessages((prev) => [...prev, { role: 'ai', content: data.response }]);

      // Clear input
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: "Sorry, I couldn't process your request. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAIOpen) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 p-6">
      {/* Chat Messages */}
      <div className="h-[60vh] overflow-y-auto mb-4 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : msg.role === 'ai'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-purple-500 text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Ask about your leads..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 bg-zinc-800 rounded text-white"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="px-4 py-3 bg-blue-500 rounded hover:bg-blue-600 transition-colors text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}