import { BACKEND_URL, getAuthToken } from './api';

interface ChatRequest {
  message: string;
  conversation_id?: string;
}

interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
  timestamp: string;
}

/**
 * Send a chat message to the backend API
 */
export const sendMessage = async (
  userId: string,
  message: string
): Promise<ChatResponse> => {
  try {
    // Ensure userId is properly formatted (extract numeric part if needed)
    const numericUserId = userId.replace('usr_', '');
    const response = await fetch(`${BACKEND_URL}/api/${numericUserId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Use the shared getAuthToken function
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Send a chat message to the backend API with conversation ID
 */
export const sendMessageWithConversation = async (
  userId: string,
  message: string,
  conversationId?: string
): Promise<ChatResponse> => {
  try {
    // Ensure userId is properly formatted (extract numeric part if needed)
    const numericUserId = userId.replace('usr_', '');
    const requestBody: ChatRequest = {
      message,
    };
    
    // Include conversation ID if provided
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/${numericUserId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Use the shared getAuthToken function
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = async (
  userId: string,
  conversationId: string
): Promise<Array<{role: string, content: string, timestamp: string}>> => {
  try {
    // Ensure userId is properly formatted (extract numeric part if needed)
    const numericUserId = userId.replace('usr_', '');
    
    const response = await fetch(`${BACKEND_URL}/api/${numericUserId}/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Use the shared getAuthToken function
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: Array<{role: string, content: string, timestamp: string}> = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    throw error;
  }
};

/**
 * Get conversation history - This is simulated since the backend doesn't provide message history per conversation
 * In a real implementation, you would need to enhance the backend to support this endpoint
 */
export const getConversationHistory = async (
  userId: string,
  conversationId: string
): Promise<any[]> => {
  // For now, return an empty array since the backend doesn't support retrieving individual conversation messages
  // The actual message history is maintained in the ChatWindow component state
  console.warn('Individual conversation history not implemented in backend');
  return [];
};

/**
 * Get user's conversations
 */
export const getUserConversations = async (userId: string): Promise<any[]> => {
  try {
    // Ensure userId is properly formatted (extract numeric part if needed)
    const numericUserId = userId.replace('usr_', '');
    const response = await fetch(`${BACKEND_URL}/api/${numericUserId}/conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Use the shared getAuthToken function
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
};