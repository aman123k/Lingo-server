# EnglishTutor Server (Lingo server)

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

- **AI-Powered Chat Services**

  - **AI Tutor (Jennifer):** Interactive conversations with personalized AI tutor
  - **Character Conversations:** Role-play with famous personalities and historical figures
  - **Debate Simulations:** Practice argumentation with AI debate partners
  - **Roleplay Scenarios:** Real-world conversation practice (booking hotels, shopping, etc.)
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

- **Grammar Feedback & Correction**

  - AI-powered grammar correction and feedback
  - Detailed explanations for grammar mistakes
  - Personalized learning suggestions

- **Character Conversations**

  - Role-play with famous personalities and historical figures (Shiva, Einstein, etc.)
  - Interactive storytelling and character-driven conversations
  - Personality-based responses with rich backstories

- **Debate Simulations**

  - Practice argumentation and critical thinking skills
  - Debate various topics from multiple perspectives
  - AI opponents with different viewpoints and debating styles

- **Roleplay Scenarios**

  - Real-world conversation practice (booking hotels, shopping, taxi rides, etc.)
  - Contextual learning through practical situations
  - Scenario-based language immersion

- **Password Reset**

  - OTP-based password recovery via email
  - Secure OTP verification

- **User Progress Analytics**

  - Multi-dimensional learning statistics aggregation
  - Weekly learning duration metrics and activity charts
  - Global XP tracking and active streak computations
  - Dynamic accuracy meter and grammar review notebook aggregating user errors

- **Multi-Session Chat History Management**

  - Session-based conversation scoping and storage
  - Starting fresh sessions without deleting history
  - Browsing archive session catalogs and deleting individual chat sessions

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
   git clone https://github.com/aman123k/Lingo-server.git
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
│   │   ├── characters/
│   │   │   ├── allCharacters.ts
│   │   │   └── characterService.ts
│   │   ├── chats/
│   │   │   ├── chatHistory.ts
│   │   │   ├── chatService.ts
│   │   │   ├── clearChat.ts
│   │   │   └── getChatSessions.ts
│   │   ├── debates/
│   │   │   ├── allDebates.ts
│   │   │   └── debatesService.ts
│   │   ├── feedback/
│   │   │   └── getFeedback.ts
│   │   ├── otp/
│   │   │   ├── otpTemplate.ts
│   │   │   ├── sentOtp.ts
│   │   │   └── verifyOtp.ts
│   │   ├── progress/
│   │   │   └── getProgress.ts
│   │   ├── roleplays/
│   │   │   ├── allRoleplays.ts
│   │   │   └── roleplaysService.ts
│   │   ├── survey/
│   │   │   └── updateSurvey.ts
│   │   ├── translate/
│   │   │   └── translateLanguage.ts
│   │   └── user/
│   │       ├── deleteUser.ts
│   │       ├── getUser.ts
│   │       ├── loginUser.ts
│   │       ├── logoutUser.ts
│   │       ├── registerUser.ts
│   │       └── updateUser.ts
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
│   │   ├── characterModel.ts
│   │   ├── conversationModel.ts
│   │   ├── debateModel.ts
│   │   ├── roleplayModel.ts
│   │   └── userModel.ts
│   ├── data/                 # Static data files
│   │   ├── charector.json
│   │   ├── debates.json
│   │   └── roleplays.json
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

| Method | Endpoint                | Description                       | Auth Required |
| ------ | ----------------------- | --------------------------------- | ------------- |
| POST   | `/api/chatService`      | Send message to AI tutor          | Yes           |
| POST   | `/api/characterService` | Chat with AI characters           | Yes           |
| POST   | `/api/debateService`    | Participate in AI debates         | Yes           |
| POST   | `/api/roleplayService`  | Practice roleplay scenarios       | Yes           |
| GET    | `/api/chatHistory`      | Get conversation history          | Yes           |
| GET    | `/api/chatSessions`     | Get all conversation sessions     | Yes           |
| GET    | `/api/allCharacter`     | Get available characters          | Yes           |
| GET    | `/api/allDebates`       | Get available debate topics       | Yes           |
| GET    | `/api/allRoleplays`     | Get available roleplay scenarios  | Yes           |
| POST   | `/api/translate`        | Translate text                    | Yes           |
| POST   | `/api/get-feedback`     | Get grammar feedback & correction | Yes           |

### Progress & Analytics

| Method | Endpoint             | Description                                                  | Auth Required |
| ------ | -------------------- | ------------------------------------------------------------ | ------------- |
| GET    | `/api/userProgress`  | Get aggregated user progress statistics, streak, XP, weekly activity, and review mistakes | Yes           |

### Session & Account

| Method | Endpoint          | Description                                                 | Auth Required |
| ------ | ----------------- | ----------------------------------------------------------- | ------------- |
| POST   | `/api/logoutUser` | Logout current user                                         | Yes           |
| DELETE | `/api/deleteUser` | Delete user account                                         | Yes           |
| DELETE | `/api/clearChat`  | Clear specific conversation session (or legacy messages)   | Yes           |

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
- Conversation mode (chat, character, debate, roleplay, etc.)
- Timestamps
- User association
- Mode-specific metadata (character names, debate topics, etc.)
- Grammar feedback and corrections for language learning
- Translation content for multilingual support
- `chatSessionId` (String, indexed) for categorizing and grouping conversations into separate sessions

#### Character Model

Stores character information:

- Character profiles with personalities and backstories
- Personality traits and interests
- Image URLs and descriptions

#### Debate Model

Stores debate topics:

- Debate subjects with multiple perspectives
- Topic descriptions and viewpoints
- Associated images and metadata

#### Roleplay Model

Stores roleplay scenarios:

- Practical conversation scenarios
- Situation descriptions and contexts
- Learning objectives and practice areas

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
- Character conversations maintain personality consistency across sessions
- Debate simulations provide balanced perspectives on controversial topics
- Roleplay scenarios focus on practical, real-world language use
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
