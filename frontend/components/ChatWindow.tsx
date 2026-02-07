import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { sendMessage as sendChatMessage, sendMessageWithConversation, getConversationMessages, getUserConversations } from '../services/chatApi';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation when chat opens
  useEffect(() => {
    if (isOpen) {
      loadLatestConversation();
    }
  }, [isOpen, userId]);

  const loadLatestConversation = async () => {
    try {
      setIsLoading(true);
      
      // Get user's conversations
      const userConversations = await getUserConversations(userId);
      
      if (userConversations && userConversations.length > 0) {
        // Sort conversations by updated_at to get the most recent one
        const sortedConversations = userConversations.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        // Get the most recent conversation (most recently updated)
        const latestConversation = sortedConversations[0];
        const convId = latestConversation.id.toString();
        
        // Load messages for this conversation
        const conversationMessages = await getConversationMessages(userId, convId);
        
        // Convert backend messages to our format, filtering out internal tool call messages
        const formattedMessages: Message[] = conversationMessages
          .filter(msg => {
            // Filter out internal tool call messages that start with "Tool call:"
            return !msg.content.startsWith('Tool call:');
          })
          .map((msg, index) => ({
            id: `msg-${index}-${Date.now()}`,
            role: msg.role === 'user' ? 'user' : 'assistant', // Map roles appropriately
            content: msg.content,
            timestamp: msg.timestamp
          }));
        
        setMessages(formattedMessages);
        setConversationId(convId);
      } else {
        // If no conversations exist, start with a welcome message
        const welcomeMessage: Message = {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      
      // On error, start with a welcome message
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Also scroll when loading state changes

  const scrollToBottom = () => {
    // Using setTimeout to ensure DOM updates are complete before scrolling
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // Using 'auto' for instant scroll to prevent jarring animation
    }, 10);
  };

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true); // Show loading indicator

    try {
      console.log('Sending message to backend:', { userId, message: inputValue, conversationId });
      // Call the conversation-aware backend API with conversation ID if available
      const response = await sendMessageWithConversation(userId, inputValue, conversationId || undefined);
      console.log('Received response from backend:', response);

      // Update conversation ID if returned by backend
      if (response.conversation_id) {
        const newConvId = response.conversation_id;
        setConversationId(newConvId);
      }

      // Add the final response to the chat
      const aiResponse: Message = {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check that the backend is running.`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col border border-gray-200 dark:border-gray-700 max-h-[90vh] max-w-[90vw]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Assistant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={messagesContainerRef}
            id="chat-messages-container"
            className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && !messages.length && (
                <div className="flex justify-center py-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              {isLoading && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChatWindow;