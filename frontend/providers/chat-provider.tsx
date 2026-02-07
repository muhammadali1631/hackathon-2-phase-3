'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './auth-provider';
import ChatWindow from '@/components/ChatWindow';

interface ChatContextType {
  isChatOpen: boolean;
  openChat: (userId?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  currentUserId: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const openChat = (userId?: string) => {
    if (user) {
      const rawId = userId || user.id;
      // Extract numeric ID from user.id (e.g., "usr_15" -> "15")
      const numericId = rawId.replace('usr_', '');
      setCurrentUserId(numericId);
      setIsChatOpen(true);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  // Update currentUserId when user changes
  useEffect(() => {
    if (user) {
      // Extract numeric ID from user.id (e.g., "usr_15" -> "15")
      const numericId = user.id.replace('usr_', '');
      setCurrentUserId(numericId);
    } else {
      setCurrentUserId(null);
    }
  }, [user]);

  const value = {
    isChatOpen,
    openChat,
    closeChat,
    toggleChat,
    currentUserId,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
      {/* Render ChatWindow if user is authenticated and chat is open */}
      {user && currentUserId && (
        <ChatWindow
          userId={currentUserId}
          isOpen={isChatOpen}
          onClose={closeChat}
        />
      )}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}