const supabase = require('../config/supabase');
const { createUser, getUserById, updateLastLogin } = require('../services/userService');
const { metrics } = require('../middleware/metricsExporter');

/**
 * Register a new user
 */
const signup = async (req, res) => {
  const startTime = Date.now();
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { email, password, username, full_name } = req.body;

    // Validate input
    if (!email || !password) {
      metrics.authAttempts.inc({ status: 'failure', type: 'signup', env });
      metrics.authDuration.observe({ type: 'signup', env }, (Date.now() - startTime) / 1000);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      metrics.authAttempts.inc({ status: 'failure', type: 'signup', env });
      metrics.authDuration.observe({ type: 'signup', env }, (Date.now() - startTime) / 1000);
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          full_name: full_name || ''
        }
      }
    });

    if (authError) {
      metrics.authAttempts.inc({ status: 'failure', type: 'signup', env });
      metrics.authDuration.observe({ type: 'signup', env }, (Date.now() - startTime) / 1000);
      return res.status(400).json({
        success: false,
        message: authError.message
      });
    }

    // Create user entry in custom users table
    // Note: This might be handled automatically by the database trigger
    // But we'll do it explicitly to ensure it happens
    try {
      if (authData.user) {
        const userData = await createUser({
          id: authData.user.id,
          email: authData.user.email,
          username: username || email.split('@')[0],
          full_name: full_name || ''
        });

        console.log('✅ User created in database table:', userData);
      }
    } catch (dbError) {
      // Log error but don't fail signup if table creation fails
      // (trigger might have already created it)
      console.log('User table entry error (may already exist):', dbError.message);
    }

    // Track successful signup
    metrics.authAttempts.inc({ status: 'success', type: 'signup', env });
    metrics.authDuration.observe({ type: 'signup', env }, (Date.now() - startTime) / 1000);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: authData.user,
        session: authData.session
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    metrics.authAttempts.inc({ status: 'error', type: 'signup', env });
    metrics.authDuration.observe({ type: 'signup', env }, (Date.now() - startTime) / 1000);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  const startTime = Date.now();
  const env = process.env.NODE_ENV || 'development';
  
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      metrics.authAttempts.inc({ status: 'failure', type: 'login', env });
      metrics.authDuration.observe({ type: 'login', env }, (Date.now() - startTime) / 1000);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      metrics.authAttempts.inc({ status: 'failure', type: 'login', env });
      metrics.loginFailures.inc({ reason: 'invalid_credentials', env });
      metrics.authDuration.observe({ type: 'login', env }, (Date.now() - startTime) / 1000);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get user data from custom table
    let userData = null;
    if (authData.user) {
      userData = await getUserById(authData.user.id);
      
      // Update last login timestamp
      await updateLastLogin(authData.user.id);
      
      console.log('✅ User logged in:', userData?.email);
    }

    // Track successful login
    metrics.authAttempts.inc({ status: 'success', type: 'login', env });
    metrics.authDuration.observe({ type: 'login', env }, (Date.now() - startTime) / 1000);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: authData.user,
        session: authData.session,
        profile: userData // Additional user data from custom table
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    metrics.authAttempts.inc({ status: 'error', type: 'login', env });
    metrics.authDuration.observe({ type: 'login', env }, (Date.now() - startTime) / 1000);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all users (for testing/admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const { getAllUsers: getAllUsersService } = require('../services/userService');
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  getAllUsers
};
