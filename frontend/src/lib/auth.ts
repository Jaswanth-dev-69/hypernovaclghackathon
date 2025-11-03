import { supabase } from './supabase';
import telemetry from './telemetry';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Sign up a new user via backend API (tracks metrics)
 */
export const signUp = async (email: string, password: string, username?: string) => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password, 
        username: username || email.split('@')[0]
      })
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    await telemetry.emitMetric({
      endpoint: '/api/auth/signup',
      method: 'POST',
      status: String(response.status),
      duration
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return { user: data.data?.user, session: data.data?.session };
  } catch (error) {
    console.error('Signup error:', error);
    
    // Track failed signup
    await telemetry.emitMetric({
      type: 'signup_failure',
      reason: error instanceof Error ? error.message : 'unknown'
    });
    
    throw error;
  }
};

/**
 * Sign in an existing user via backend API (tracks metrics)
 */
export const signIn = async (email: string, password: string) => {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const duration = (performance.now() - startTime) / 1000;
    
    // Track metrics
    await telemetry.emitMetric({
      endpoint: '/api/auth/login',
      method: 'POST',
      status: String(response.status),
      duration
    });

    const data = await response.json();

    if (!response.ok) {
      // Track failed login with reason
      await telemetry.emitMetric({
        type: 'login_failure',
        reason: response.status === 401 ? 'invalid_credentials' : 'server_error'
      });
      
      throw new Error(data.message || 'Login failed');
    }

    return { user: data.data?.user, session: data.data?.session };
  } catch (error) {
    console.error('Sign in error:', error);
    
    // Track failed login
    await telemetry.emitMetric({
      type: 'login_failure',
      reason: error instanceof Error ? error.message : 'unknown'
    });
    
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get the current user session
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
};
