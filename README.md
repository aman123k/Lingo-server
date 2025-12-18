# EnglishTutor Server

A Node.js/Express.js backend server for an AI-powered English learning platform. This server provides RESTful APIs for user authentication, AI-powered chat conversations, language translation, and user management features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Running the Server](#running-the-server)
- [Configuration](#configuration)
- [Development](#development)

## ✨ Features

- **User Authentication**

  - Email/password registration and login
  - OAuth integration with Google and GitHub
  - JWT-based authentication
  - Cookie-based session management

- **AI-Powered Chat Service**

  - Interactive conversations with AI tutor (Jennifer)
  - Context-aware responses using conversation history
  - Personalized learning based on user profile
  - Streaming responses from Google Gemini AI

- **User Profile & Survey**

  - Comprehensive user onboarding survey
  - Learning preferences tracking (language level, goals, style)
  - Profile management

- **Language Translation**

  - Real-time text translation
  - Supports multiple target languages

- **Password Reset**

  - OTP-based password recovery via email
  - Secure OTP verification

- **Security Features**

  - Rate limiting for API endpoints
  - CORS configuration
  - Request compression
  - Input validation

- **Data Persistence**
  - MongoDB for user and conversation data
  - Redis for caching and session management

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- **AI:** Google Gemini AI (@google/genai)
- **Authentication:** JWT, OAuth 2.0
- **Email:** Resend
- **Security:** bcrypt, express-rate-limit, cors
- **Other:** dotenv, compression, cookie-parser

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas connection string)
- **Redis** (local instance or cloud Redis service)

## 🚀 Installation

1. **Clone the repository** (if not already done)

   ```bash
   git clone <repository-url>
   cd EnglishTutor/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and configure the required variables (see [Environment Variables](#environment-variables) section).

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000
REQUEST_URL=http://localhost:3000

# Database
DATABASE_URL=mongodb://localhost:27017/englishtutor
# Or use MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
# For local Redis:
# REDIS_URL=redis://127.0.0.1:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Google Gemini AI
GEMINI_API_KEY=your-google-gemini-api-key

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key
```

### Getting API Keys

- **Google Gemini API:** Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Google OAuth:** Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
- **GitHub OAuth:** Create OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)
- **Resend API:** Get API key from [Resend](https://resend.com/)

## 📁 Project Structure

```
server/
├── src/
│   ├── auth/                 # OAuth authentication handlers
│   │   ├── googleAuth.ts
│   │   └── githubAuth.ts
│   ├── constants/            # Application constants
│   │   └── messages.ts
│   ├── controller/           # Business logic controllers
│   │   ├── chats/
│   │   │   ├── chatHistory.ts
│   │   │   └── chatService.ts
│   │   ├── otp/
│   │   │   ├── otpTemplate.ts
│   │   │   ├── sentOtp.ts
│   │   │   └── verifyOtp.ts
│   │   ├── survey/
│   │   │   └── updateSurvey.ts
│   │   ├── translate/
│   │   │   └── translateLanguage.ts
│   │   └── user/
│   │       ├── getUser.ts
│   │       ├── loginUser.ts
│   │       └── registerUser.ts
│   ├── db/                   # Database connection
│   │   └── connectDb.ts
│   ├── index.ts              # Application entry point
│   ├── interface/            # TypeScript interfaces
│   │   └── interface.ts
│   ├── lib/                  # Utility libraries
│   │   ├── ai/
│   │   │   ├── genaiClient.ts
│   │   │   └── genaiTranslate.ts
│   │   ├── prompts/
│   │   │   ├── generatePrompt.ts
│   │   │   └── generateTranslate.ts
│   │   └── storeCookie.ts
│   ├── middleware/           # Express middleware
│   │   ├── rateLimiter.ts
│   │   └── verifyToken.ts
│   ├── model/                # Mongoose models
│   │   ├── conversationModel.ts
│   │   └── userModel.ts
│   ├── redis/                # Redis client
│   │   └── redisClient.ts
│   ├── router/               # API routes
│   │   └── web.ts
│   └── token/                # JWT utilities
│       └── jwtToken.ts
├── build/                    # Compiled JavaScript (generated)
├── node_modules/             # Dependencies
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint          | Description                    | Auth Required |
| ------ | ----------------- | ------------------------------ | ------------- |
| POST   | `/api/register`   | Register a new user            | No            |
| POST   | `/api/login`      | Login user                     | No            |
| POST   | `/api/googleAuth` | Authenticate with Google OAuth | No            |
| POST   | `/api/githubAuth` | Authenticate with GitHub OAuth | No            |

### User

| Method | Endpoint               | Description                  | Auth Required |
| ------ | ---------------------- | ---------------------------- | ------------- |
| GET    | `/api/userInformation` | Get current user information | Yes           |
| POST   | `/api/survey`          | Update user survey/profile   | Yes           |
| POST   | `/api/updateUserInfo`  | Update user profile details  | Yes           |

### Chat & Translation

| Method | Endpoint           | Description              | Auth Required |
| ------ | ------------------ | ------------------------ | ------------- |
| POST   | `/api/chatService` | Send message to AI tutor | Yes           |
| GET    | `/api/chatHistory` | Get conversation history | Yes           |
| POST   | `/api/translate`   | Translate text           | Yes           |

### Session & Account

| Method | Endpoint          | Description         | Auth Required |
| ------ | ----------------- | ------------------- | ------------- |
| POST   | `/api/logoutUser` | Logout current user | Yes           |
| DELETE | `/api/deleteUser` | Delete user account | Yes           |

### Password Reset

| Method | Endpoint               | Description                   | Auth Required |
| ------ | ---------------------- | ----------------------------- | ------------- |
| POST   | `/api/forgot-password` | Send OTP to email             | No            |
| POST   | `/api/verify-otp`      | Verify OTP and reset password | No            |

### Health Check

| Method | Endpoint  | Description         | Auth Required |
| ------ | --------- | ------------------- | ------------- |
| GET    | `/status` | Server status check | No            |

## 🏃 Running the Server

### Development Mode

Run the server in development mode with hot-reload using nodemon:

```bash
npm run dev
```

The server will start on `http://localhost:4000` (or the port specified in your `.env` file).

### Production Build

1. **Build the TypeScript code:**

   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Rate Limiting

The server implements rate limiting for various endpoints:

- **Authentication routes:** 60 requests per minute
- **OTP requests:** 3 requests per hour
- **Chat/Translation:** 6 requests per hour

Rate limit configurations can be adjusted in `src/middleware/rateLimiter.ts`.

### CORS

CORS is configured to allow requests from the frontend URL specified in `REQUEST_URL` environment variable. Update this to match your frontend deployment URL.

### Request Limits

- JSON payload: 50MB
- URL-encoded payload: 5MB

### AI Model Configuration

The server uses **Gemini 2.5 Pro** model with:

- Google Search integration enabled
- Thinking budget: unlimited (-1)
- Streaming responses enabled

## 🔧 Development

### Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

### Code Style

- TypeScript strict mode enabled
- ES2020 target
- Node.js ESM module resolution

### Database Models

#### User Model

Stores user information including:

- Authentication details (email, password, OAuth providers)
- Learning preferences (language level, goals, style, etc.)
- Survey completion status

#### Conversation Model

Stores chat conversations:

- User and AI messages
- Conversation mode (chat, translate, etc.)
- Timestamps
- User association

### Middleware

- **verifyTokenMiddleware:** Validates JWT tokens for protected routes
- **authLimiter:** Rate limits authentication endpoints
- **otpLimiter:** Rate limits OTP requests
- **chatLimiter:** Rate limits chat and translation endpoints

## 📝 Notes

- The server requires MongoDB and Redis to be running
- JWT tokens are stored in HTTP-only cookies for security
- Conversation history is limited to the last 50 messages for context
- The AI tutor (Jennifer) is personalized based on user survey data
- OTP codes are stored in Redis with expiration times

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are signed and verified
- Rate limiting prevents abuse
- CORS is configured to restrict origins
- Environment variables for sensitive data
- HTTP-only cookies for token storage

## 📄 License

ISC

---

For questions or issues, please open an issue in the repository.
