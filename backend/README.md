# E-Commerce Backend

Backend server for the e-commerce application with Supabase authentication.

## Features

- Supabase authentication integration
- User signup and login
- JWT token management
- RESTful API endpoints
- CORS enabled for frontend
- Security middleware (Helmet)
- Request logging (Morgan)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

3. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

## Tech Stack

- Node.js + Express
- Supabase (Authentication & Database)
- JWT for tokens
- Helmet for security
- Morgan for logging
- CORS for cross-origin requests
