# 🎬 ChooFlex Main Application

## 📋 Overview

The **Main-App** is the primary customer-facing application of the ChooFlex streaming platform. It provides a Netflix-like experience with modern web technologies and includes an integrated AI chatbot for intelligent content discovery.

## 🏗️ Architecture

```
Main-App/
├── 📂 backend/          # Node.js API Server (Port: 8000)
├── 📂 frontend/         # React + Vite Customer Interface (Port: 5174)
└── README.md           # This documentation
```

## 🛠️ Technology Stack

### Frontend (Port: 5174)
- **React 18.3.1** - Modern UI library with hooks
- **Vite 7.1.2** - Ultra-fast build tool with HMR
- **React Router DOM 7.8.0** - Client-side routing
- **TanStack React Query 5.85.5** - Server state management
- **Sass 1.90.0** - CSS preprocessing
- **Axios 1.11.0** - HTTP client
- **React Icons 5.0.1** - Icon library

### Backend (Port: 8000)
- **Node.js 20+** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB + Mongoose 8.17.0** - Database & ODM
- **JWT 9.0.2** - Authentication
- **bcrypt 6.0.0** - Password hashing
- **CORS 2.8.5** - Cross-origin requests

## ✨ Key Features

### 🎬 Customer Features
- **🏠 Home Page**: Featured content with personalized recommendations
- **🎭 Movies & Series**: Browse comprehensive content library
- **🔍 Smart Search**: Real-time search with TMDB integration
- **👤 User Profiles**: Personal accounts with watchlist management
- **📺 Video Player**: Advanced streaming interface
- **🤖 AI Assistant**: Integrated chatbot for content recommendations

### 🤖 AI Chat Integration
- **🧠 Intelligent Conversations**: OpenAI GPT-3.5-turbo powered
- **🎯 Content Expertise**: Deep knowledge of all movies and series
- **🌍 Multilingual**: Arabic and English support
- **📱 Draggable Interface**: Freely movable chat widget
- **💬 Context Awareness**: Maintains conversation history

## 🚀 Quick Start

### Prerequisites
```bash
# Required
- Node.js 18+
- MongoDB 7.0+
- OpenAI API Key (for AI features)
```

### Backend Setup
```bash
cd Main-App/backend/

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm start
# Server runs on http://localhost:8000
```

### Frontend Setup
```bash
cd Main-App/frontend/

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5174
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Content
```
GET  /api/movies          # Get all movies (public for AI)
GET  /api/movies/random   # Get random content
GET  /api/movies/find/:id # Get specific movie
GET  /api/series          # Get all series
GET  /api/search          # Search content
```

### User Management
```
GET  /api/users/find/:id  # Get user profile
PUT  /api/users/:id       # Update user
```

## 🗄️ Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  profilePic: String,
  isAdmin: Boolean,
  preferences: {
    favoriteGenres: [String],
    watchHistory: [ObjectId]
  }
}
```

### Movie Model
```javascript
{
  tmdbId: Number,
  title: String,
  desc: String,
  img: String,
  year: String,
  genre: String,
  isSeries: Boolean,
  featured: Boolean
}
```

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── featured/           # Hero banner components
│   ├── list/              # Content list components
│   ├── movieCard/         # Movie card components
│   ├── navbar/            # Navigation components
│   ├── AIChatWidget/      # AI chatbot integration
│   └── ...
├── pages/
│   ├── Home/              # Home page
│   ├── Movies/            # Movies listing
│   ├── Series/            # Series listing
│   └── ...
├── services/
│   └── api.js             # API configuration
├── styles/
│   └── global.scss        # Global styles
└── utils/
    ├── AuthContext.jsx    # Authentication context
    └── helpers.js         # Utility functions
```

## 🔐 Authentication Flow

1. **User Registration/Login** → JWT token generated
2. **Token Storage** → Stored in localStorage
3. **API Requests** → Axios interceptor adds token
4. **Route Protection** → Private routes check authentication

## 🎯 Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Backend
npm start            # Start server
npm run dev          # Start with nodemon
npm run seed         # Seed database
```

## 🌐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/netflix
JWT_SECRET=your_super_secure_jwt_secret
PORT=8000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_AI_API_URL=http://localhost:8000/api
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop**: Full-featured desktop experience
- **4K Displays**: High-resolution support

## 🚀 Performance Features

- **Code Splitting**: Lazy loading of routes and components
- **Image Optimization**: Responsive images with lazy loading
- **Caching**: React Query for intelligent server state caching
- **Bundle Optimization**: Vite's efficient bundling

## 🔗 Integration Points

- **Admin Dashboard**: User and content management
- **AI Chatbot**: Intelligent content recommendations
- **TMDB API**: Real movie and series data
- **File Upload**: Image and media handling

## 📊 Current Statistics

- **Content Library**: 183+ movies, 50+ series
- **User Features**: Authentication, profiles, watchlists
- **AI Integration**: Natural language content discovery
- **Performance**: <2s page load times
- **Mobile**: 100% responsive design

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the ChooFlex streaming platform ecosystem.

---

**🎬 The Main-App delivers a premium streaming experience with intelligent AI assistance, making content discovery natural and enjoyable for users.**
