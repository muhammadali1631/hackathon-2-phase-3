// API Configuration
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://alishahzad32-todo-phase-3.hf.space';

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Try both possible token names to ensure compatibility
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
  }
  return null;
};

// Utility function to make authenticated API calls
export const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // Ensure the endpoint starts with the correct API path
  const url = endpoint.startsWith('/api/') ? `${BACKEND_URL}${endpoint}` : `${BACKEND_URL}/api${endpoint}`;

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response;
};