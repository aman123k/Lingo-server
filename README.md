# ⚙️ EnglishTutor Backend Server (Lingo Server)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose--7.8-green?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Redis](https://img.shields.io/badge/Redis-5.9-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-GenAI--1.14-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)

> **Lingo Server** is a robust, high-performance Node.js / Express.js / TypeScript RESTful backend that powers the Lingo AI English learning ecosystem. It orchestrates real-time conversational AI streaming via Google Gemini, handles OAuth and JWT session security, manages multi-session chat histories, processes Razorpay subscriptions, tracks user progress analytics, and sends transactional email verification codes via Resend.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔌 REST API Endpoint Catalog](#-rest-api-endpoint-catalog)
- [📁 Project Structure](#-project-structure)
- [🔐 Environment Variables](#-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🛡️ Security & Middleware](#️-security--middleware)
- [📄 License](#-license)

---

## ✨ Features

- **🤖 Google Gemini AI Streaming**: Real-time context-aware streaming responses using `@google/genai` tuned with adaptive system prompts based on user level and learning goals.
- **🎯 Multi-Mode AI Engines**:
  - **Jennifer AI Tutor**: Adaptive conversational tutor with real-time error detection.
  - **Historical & Famous Characters**: Personality-infused conversations (e.g. Einstein, Shiva).
  - **Intellectual Debates**: Argumentative counter-arguments on philosophical and societal topics.
  - **Roleplays & Travel Scenarios**: Practical situational dialogues (hotel booking, airports, dining, interviews).
  - **Unified Learning Mode Service**: Multi-purpose engine supporting business coaching, story co-writing, and voice practice.
- **📝 Live Grammar Feedback & Translation**: Contextual grammar error extraction with corrections and multi-language text translation.
- **🔐 Multi-Method Authentication**:
  - Email & password signup/login with bcrypt hashing.
  - Google OAuth 2.0 integration (`googleAuth.ts`).
  - GitHub OAuth 2.0 integration (`githubAuth.ts`).
  - HTTP-only cookie-based JWT session security.
- **✉️ OTP & Password Recovery**: Redis-backed temporary OTP generation sent via Resend email API.
- **💳 Razorpay Payment & Subscriptions**: Cryptographically verified subscription ordering and payment validation (`razorpay`).
- **📊 Analytics & Grammar Notebook Engine**: Dynamic calculation of user XP, consecutive daily streaks, message activity charts, and personal error notebooks.
- **🗂️ Session Management**: Dynamic session categorization (`chatSessionId`) enabling user session creation, history archiving, and granular chat deletion.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js (v18+), TypeScript 5.9
- **Framework**: Express.js 4.21
- **Database & Modeling**: MongoDB, Mongoose 7.8
- **Caching & In-Memory Store**: Redis 5.9
- **AI Integration**: `@google/genai` (Google Gemini 2.5 Pro model family)
- **Payment Processing**: Razorpay 2.9
- **Email Service**: Resend 6.5
- **Authentication**: JWT (`jsonwebtoken`), bcrypt 6.0, Cookie Parser
- **Middlewares & Security**: `express-rate-limit`, `cors`, `compression`, `dotenv`

---

## 🔌 REST API Endpoint Catalog

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Register new user account | No | Yes (authLimiter) |
| `POST` | `/api/login` | Authenticate user with password | No | Yes (authLimiter) |
| `POST` | `/api/googleAuth` | Authenticate / register via Google OAuth | No | No |
| `POST` | `/api/githubAuth` | Authenticate / register via GitHub OAuth | No | No |
| `POST` | `/api/logoutUser` | Clear HTTP-only auth cookie and logout | Yes | No |

### 👤 User Profile & Survey

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/userInformation` | Retrieve current user profile and stats | Yes | No |
| `POST` | `/api/survey` | Save or update user onboarding survey answers | Yes | No |
| `POST` | `/api/updateUserInfo` | Update account details (name, avatar, etc.) | Yes | No |
| `DELETE` | `/api/deleteUser` | Permanently delete user account and associated data | Yes | No |

### 💳 Payments & Subscriptions

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/subscribe` | Update user subscription tier status | Yes | No |
| `POST` | `/api/payment/order` | Create a new Razorpay payment order | Yes | No |
| `POST` | `/api/payment/verify` | Verify Razorpay payment signature & confirm | Yes | No |

### 🔑 Password Reset & OTP

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/forgot-password` | Generate & send OTP to user email via Resend | No | Yes (otpLimiter) |
| `POST` | `/api/verify-otp` | Verify OTP code from Redis and update password | No | No |

### 🤖 AI Services & Learning Modes

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/chatService` | Send message to AI tutor Jennifer | Yes | Yes (chatLimiter) |
| `POST` | `/api/characterService` | Chat with selected character personality | Yes | Yes (chatLimiter) |
| `POST` | `/api/debateService` | Chat with AI debate opponent | Yes | Yes (chatLimiter) |
| `POST` | `/api/roleplayService` | Participate in roleplay scenarios | Yes | Yes (chatLimiter) |
| `POST` | `/api/travelsService` | Practice travel English scenario dialogues | Yes | Yes (chatLimiter) |
| `POST` | `/api/learningModeService` | Generic service for extra learning modes | Yes | Yes (chatLimiter) |
| `POST` | `/api/translate` | Translate text into user's target language | Yes | Yes (chatLimiter) |
| `POST` | `/api/get-feedback` | Request grammar correction and explanations | Yes | Yes (chatLimiter) |

### 📚 Data & Catalogs

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/allCharacter` | List all available character profiles | Yes | No |
| `GET` | `/api/allDebates` | List all available debate topics | Yes | No |
| `GET` | `/api/allRoleplays` | List all available roleplay scenarios | Yes | No |
| `GET` | `/api/allTravels` | List all available travel scenarios | Yes | No |

### 🗂️ Chat Sessions & History

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/chatHistory` | Fetch chat messages for active/specified session | Yes | No |
| `GET` | `/api/chatSessions` | Fetch all historical chat session metadata | Yes | No |
| `DELETE` | `/api/clearChat` | Delete specific session or clear history | Yes | No |

### 📊 Analytics & Support

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/userProgress` | Aggregate XP, streaks, accuracy & notebook error log | Yes | No |
| `POST` | `/api/addSupport` | Submit support ticket/feedback | Yes | No |

---

## 📁 Project Structure

```
server/
├── src/
│   ├── auth/                 # OAuth provider implementations (Google, GitHub)
│   │   ├── googleAuth.ts
│   │   └── githubAuth.ts
│   ├── constants/            # Global constants and message strings
│   ├── controller/           # Business logic controllers
│   │   ├── characters/       # Character list & conversation service
│   │   ├── chats/            # Jennifer chat service, sessions, clear chat, mode service
│   │   ├── debates/          # Debate topics catalog & simulation service
│   │   ├── feedback/         # AI grammar correction engine
│   │   ├── otp/              # OTP email template, sending, and verification
│   │   ├── payment/          # Razorpay order generation & verification
│   │   ├── progress/         # Analytics aggregator & stats computation
│   │   ├── roleplays/        # Roleplay scenarios & conversation service
│   │   ├── support/          # Customer support inquiry logger
│   │   ├── survey/           # User survey update controller
│   │   ├── translate/        # Text translation service
│   │   ├── travels/          # Travel scenarios & conversation service
│   │   └── user/             # User registration, login, profile edit, subscription
│   ├── data/                 # JSON catalogs (charector.json, debates.json, roleplays.json, travels.json)
│   ├── db/                   # MongoDB connection & index sync scripts
│   ├── interface/            # TypeScript interfaces & type definitions
│   ├── lib/                  # Gemini AI client (`genaiClient.ts`), translation & prompt generators
│   ├── middleware/           # JWT verification (`verifyToken.ts`), rate limiters (`rateLimiter.ts`)
│   ├── model/                # Mongoose Models (User, Conversation, Character, Debate, Roleplay)
│   ├── redis/                # Redis client connection and helper functions
│   ├── router/               # Express master router (`web.ts`)
│   ├── token/                # JWT token signing & cookie helpers
│   └── index.ts              # Express application entry point
├── build/                    # Compiled JavaScript output (generated via npm run build)
├── .env                      # Environment configuration variables
├── package.json              # Node.js dependencies and scripts
└── tsconfig.json             # TypeScript build configuration
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` root directory:

```env
# Server Port & Frontend Origin
PORT=8080
REQUEST_URL=http://localhost:3000

# Security Secrets
TOKEN_KEY=your_super_secret_jwt_key

# Database Connection
DATABASE_URL=mongodb://localhost:27017/englishTutor
# Or MongoDB Atlas:
# DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/englishTutor

# Redis Connection
REDIS_HOST=your-redis-host-url
REDIS_PASSWORD=your-redis-password

# AI Engine Key
GEMINI_API_KEY=your-google-gemini-api-key

# OAuth Credentials
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_KEY=your-github-client-secret

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key
SENDER_EMAIL="Lingo <onboarding@resend.dev>"

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Redis** (Local instance or Redis Cloud)
- **Google Gemini API Key**

### Installation Steps

1. Navigate into the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`.

4. Sync initial data/indexes (optional):
   ```bash
   npm run db:sync
   ```

5. Launch the development server with hot-reload:
   ```bash
   npm run dev
   ```
   The server will start listening on `http://localhost:8080`.

### Production Build

```bash
# Compile TypeScript to JavaScript in build/ directory
npm run build

# Run production server
npm start
```

---

## 🛡️ Security & Middleware

- **JWT Cookie Protection**: Tokens are signed using `TOKEN_KEY` and transmitted via HTTP-only, secure cookies.
- **Rate Limiting**:
  - `authLimiter`: 60 requests per minute on login/register endpoints.
  - `otpLimiter`: 3 requests per hour on password recovery endpoints.
  - `chatLimiter`: Rate limits AI generation endpoints to preserve API quotas.
- **Data Validation & Sanitization**: Strict TypeScript schemas and Mongoose validation rules.
- **CORS Restrictions**: Configured to restrict origin requests exclusively to `REQUEST_URL`.

---

## 📄 License

This project is licensed under the **ISC License**.
