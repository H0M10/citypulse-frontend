import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth

export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      }
    }
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/#/auth?mode=reset',
  });
  return { data, error };
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

export const resendConfirmationEmail = async (email) => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  return { data, error };
};

// Database

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Ubicaciones guardadas
export const getSavedLocations = async (userId) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const saveLocation = async (locationData) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .insert([locationData])
    .select()
    .single();
  return { data, error };
};

export const deleteLocation = async (locationId) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .delete()
    .eq('id', locationId);
  return { data, error };
};

export const toggleFavorite = async (locationId, isFavorite) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .update({ is_favorite: isFavorite })
    .eq('id', locationId)
    .select()
    .single();
  return { data, error };
};

// Historial de exploración
export const getExplorationHistory = async (userId) => {
  const { data, error } = await supabase
    .from('exploration_history')
    .select('*')
    .eq('user_id', userId)
    .order('explored_at', { ascending: false })
    .limit(50);
  return { data, error };
};

export const addExploration = async (explorationData) => {
  const { data, error } = await supabase
    .from('exploration_history')
    .insert([explorationData])
    .select()
    .single();
  return { data, error };
};

// Reseñas
export const getCityReviews = async (city) => {
  const { data, error } = await supabase
    .from('city_reviews')
    .select(`*, profiles(username, avatar_url, display_name)`)
    .eq('city', city)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getUserReviews = async (userId) => {
  const { data, error } = await supabase
    .from('city_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('city_reviews')
    .insert([reviewData])
    .select()
    .single();
  return { data, error };
};

export const deleteReview = async (reviewId) => {
  const { data, error } = await supabase
    .from('city_reviews')
    .delete()
    .eq('id', reviewId);
  return { data, error };
};

// API Logs
export const logApiCall = async (logData) => {
  try {
    await supabase
      .from('api_usage_logs')
      .insert([logData]);
  } catch {
    // Silent fail para logs
  }
};
