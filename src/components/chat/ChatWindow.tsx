'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Image } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  imageUrl?: string;
  status: string;
  senderId: string;
  sender: {
    name?: string;
    image?: string;
  };
  createdAt: string;
}

interface ChatWindowProps {
  matchId: string;
  userId: string;
  partnerName?: string;
}

export default function ChatWindow({
  matchId,
  userId,
  partnerName = 'User',
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // 3초마다 새 메시지 확인
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages?matchId=${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageContent = input;
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          senderId: userId,
          content: messageContent,
        }),
      });

      if (res.ok) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setInput(messageContent);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black rounded-2xl border border-gold/20">
      {/* Header */}
      <div className="p-4 border-b border-gold/20 bg-gray-900">
        <h3 className="font-bold text-white">{partnerName}</h3>
        <p className="text-xs text-gray-400">Online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              대화를 시작해보세요! 💬
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === userId
                    ? 'bg-gold text-black'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="attachment"
                    className="w-full rounded mb-2 max-h-48"
                  />
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gold/20 bg-gray-900 flex gap-2">
        <button className="p-2 hover:bg-gold/10 rounded-lg transition">
          <Image className="h-5 w-5 text-gold" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-gold outline-none"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="p-2 bg-gold hover:bg-yellow-500 disabled:opacity-50 text-black rounded-lg transition font-bold"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
