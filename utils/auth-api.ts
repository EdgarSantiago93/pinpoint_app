import { API_BASE_URL } from '@/utils/constants';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  pins?: number;
  collections?: number;
  visitCount?: number;
  wishlistCount?: number;
}

export interface ValidateEmailResponse {
  ok: boolean;
}
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
export async function validateEmail(
  email: string
): Promise<{ ok: boolean; action?: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/validate-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function refreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    name?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export async function register(
  email: string,
  username: string,
  password: string,
  name?: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password, name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getMe(
  accessToken: string,
  options?: {
    pins?: boolean;
    collections?: boolean;
    visitCount?: boolean;
    wishlistCount?: boolean;
  }
): Promise<UserResponse> {
  const queryParams = new URLSearchParams(
    Object.fromEntries(
      Object.entries(options || {}).map(([key, value]) => [
        key,
        value?.toString(),
      ])
    )
  );
  console.log('queryParams', queryParams.toString());
  const response = await fetch(
    `${API_BASE_URL}/auth/me?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
