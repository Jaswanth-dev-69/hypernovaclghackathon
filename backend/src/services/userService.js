const supabase = require('../config/supabase');

/**
 * Create a new user in the user_details table
 */
const createUser = async (userData) => {
  try {
    const { id, email, username, full_name, avatar_url, phone, address } = userData;

    const { data, error } = await supabase
      .from('user_details')
      .insert([
        {
          user_id: id,
          email,
          full_name: full_name || '',
          avatar_url: avatar_url || null,
          phone: phone || null,
          address: address || null,
          login_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user in table:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Create user service error:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

/**
 * Get user by email
 */
const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get user by email error:', error);
    return null;
  }
};

/**
 * Update user last login timestamp
 */
const updateLastLogin = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_details')
      .update({ 
        last_login_at: new Date().toISOString(),
        login_count: supabase.raw('login_count + 1')
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating last login:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Update last login error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updates) => {
  try {
    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('user_details')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

/**
 * Delete user
 */
const deleteUser = async (userId) => {
  try {
    const { error } = await supabase
      .from('user_details')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateLastLogin,
  updateUserProfile,
  getAllUsers,
  deleteUser
};
