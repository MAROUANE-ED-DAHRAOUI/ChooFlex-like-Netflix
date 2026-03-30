# 🎬 ChooFlex - Complete Streaming Platform with Integrated AI Assistant

## 📋 Project Overview

**ChooFlex** is a comprehensive full-stack Netflix-inspired streaming platform built with cutting-edge web technologies. The project consists of interconnected applications providing a complete streaming ecosystem with user-facing content consumption, administrative content management, and intelligent AI-powered assistance integrated directly into the main application.

### 🎯 Project Goals
- ✅ **User Experience**: Netflix-like interface for browsing and streaming content
- ✅ **Content Management**: Comprehensive admin dashboard for CRUD operations
- ✅ **Real Data Integration**: TMDB API integration for authentic movie/series data
- ✅ **Full Authentication**: Secure JWT-based user management system
- ✅ **Responsive Design**: Mobile-first approach with modern UI/UX
- ✅ **AI Integration**: OpenAI-powered chatbot widget integrated into the main application
- ✅ **Production Ready**: Scalable architecture with proper error handling

---

## 🏗️ Complete Architecture

### 📁 Project Structure
```
ChooFlex/
├── 📂 Main-App/
│   ├── 📂 backend/                     # Main Node.js API Server with AI Chat (Port: 8000)
│   └── 📂 frontend/                    # Customer App with Integrated AI Widget (Port: 5174)
├── 📂 Admin-Dashboard/
│   ├── 📂 backend/                     # Admin API Server (Port: 5001)
│   └── 📂 frontend/                    # Admin Dashboard (Port: 3001)
├── README.md                           # Comprehensive documentation
└── PROJECT_SUMMARY.md                  # This summary file
```

### 🔄 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TMDB API      │    │   MongoDB       │    │   File Storage  │    │   OpenAI API    │
│   (External)    │    │   Database      │    │   (Uploads)     │    │   GPT-3.5       │
└─────┬───────────┘    └─────┬───────────┘    └─────┬───────────┘    └─────┬───────────┘
      │                      │                      │                      │
      ▼                      ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND LAYER                                           │
├─────────────────┬─────────────────────────────────────────────────────────────────┤
│  Main Backend   │  Admin Dashboard Backend                                        │
│  (Port: 8000)   │  (Port: 5001)                                                  │
│  - Auth API     │  - Content Management API                                      │
│  - Movies API   │  - User Management API                                         │
│  - Search API   │  - Analytics API                                               │
│  - AI Chat API  │  - Settings Management                                         │
│  - Lists API    │                                                                │
└─────────────────┴─────────────────────────────────────────────────────────────────┘
      │                      │
      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Main Frontend  │    │  Admin Frontend │
│  (Port: 5174)   │    │  (Port: 3001)   │
│  - User App     │    │  - Admin Panel  │
│  - AI Widget    │    │  - Analytics    │
│  - Streaming    │    │  - Management   │
└─────────────────┘    └─────────────────┘
```

---

## 📱 Applications Overview

### 🎬 Main Customer Application (`Main-App/`)

**Purpose**: Customer-facing streaming platform with integrated AI assistance  
**Frontend Port**: `http://localhost:5174`  
**Backend Port**: `http://localhost:8000`  
**Build Tool**: Vite  
**AI Integration**: OpenAI-powered chatbot widget

#### 📄 Main Application Features
- **🏠 Home Dashboard**: Featured content, movie rows, personalized recommendations with AI suggestions
- **🎬 Movies Catalog**: Browse all movies with intelligent filtering and AI-powered content discovery
- **📺 Series Catalog**: Browse TV series with categories and AI-enhanced recommendations
- **🔍 Smart Search**: Real-time search with TMDB integration and AI-enhanced results
- **👤 Personal Watchlist**: Watchlist management with AI curation
- **⚙️ User Settings**: Profile management, preferences, and AI chat settings
- **📺 Video Player**: Advanced streaming interface with AI recommendations
- **🔐 Authentication**: Secure login and registration system
- **🤖 AI Chat Widget**: Intelligent content assistant integrated throughout the platform

#### 🧩 Key Frontend Components
- **🎨 HeroBanner**: Dynamic featured content showcase
- **🎬 MovieCard**: Interactive movie/series cards with hover effects
- **📜 MovieRow**: Horizontal scrolling content lists
- **🔍 SearchResults**: AI-enhanced search results display
- **🤖 AIChatWidget**: Draggable AI assistant widget
- **🧭 Navigation**: Responsive navigation with user authentication

#### 🤖 AI Chat Widget Features
- **💬 Natural Language Processing**: Understanding complex user queries in Arabic and English
- **🎬 Content Expertise**: Comprehensive knowledge of all movies and series
- **🔍 Intelligent Recommendations**: Personalized content suggestions
- **🎯 Smart Positioning**: Widget appears near click location with smart boundary detection
- **🔄 Draggable Interface**: Both button and chat window can be repositioned
- **⚡ Real-time Responses**: Fast OpenAI GPT-3.5-turbo integration
- **🌍 Multilingual Support**: Fluent conversations in Arabic and English

#### 🛠️ Technology Stack (Frontend)
- **React 18.3.1** - Modern UI library with hooks
- **Vite 7.1.2** - Ultra-fast build tool with HMR
- **React Router DOM 7.8.0** - Client-side routing
- **TanStack React Query 5.85.5** - Server state management
- **Sass 1.90.0** - CSS preprocessing
- **Axios 1.11.0** - HTTP client
- **React Icons 5.5.0** - Icon library
- **Material-UI 7.3.1** - UI components

### 🛠️ Admin Dashboard (`Admin-Dashboard/`)

**Purpose**: Comprehensive administration interface for content and user management  
**Frontend Port**: `http://localhost:3001`  
**Backend Port**: `http://localhost:5001`  
**Build Tool**: Create React App  

#### 🎛️ Admin Features
- **📊 Analytics Dashboard**: Real-time platform statistics and user insights
- **🎬 Content Management**: CRUD operations for movies and series
- **👥 User Management**: User accounts, permissions, and activity monitoring
- **📈 Performance Metrics**: Platform usage analytics and content performance
- **⚙️ System Settings**: Platform configuration and preferences
- **📤 File Upload**: Media management and file handling

#### 🛠️ Technology Stack (Admin)
- **React 18.2.0** - UI library
- **React Router DOM** - Navigation
- **Axios** - API communication
- **Chart.js** - Analytics visualization
- **React Toastify** - Notifications

---

## 🔧 Backend Services

### 🌐 Main API Server (`Main-App/backend/`)

**Purpose**: Core application API with integrated AI chat functionality  
**Port**: `http://localhost:8000`  
**Database**: MongoDB with optimized schemas  
**AI Integration**: OpenAI GPT-3.5-turbo direct integration

#### 📡 API Endpoints
```
Authentication:
POST /api/auth/register    # User registration with validation
POST /api/auth/login       # Secure user login with JWT

Movies & Series:
GET  /api/movies          # Public endpoint with AI-friendly metadata
GET  /api/movies/random   # Random content with enhanced details
GET  /api/movies/find/:id # Specific movie with complete information
GET  /api/series          # TV series catalog
POST /api/movies          # Create movie (admin) with AI tagging
PUT  /api/movies/:id      # Update movie (admin) with validation
DELETE /api/movies/:id    # Safe delete movie (admin)

Content Lists:
GET  /api/lists           # Get content lists with AI categorization
POST /api/lists           # Create list (admin) with smart grouping
PUT  /api/lists/:id       # Update list (admin)
DELETE /api/lists/:id     # Delete list (admin)

Search:
GET  /api/search          # Advanced search with TMDB integration

AI Chat (NEW):
POST /api/chat            # AI conversation endpoint with OpenAI integration
GET  /api/chat/health     # AI service health check

User Management:
GET  /api/users/find/:id  # Get user profile
PUT  /api/users/:id       # Update user profile
DELETE /api/users/:id     # Delete user (admin)

Health Check:
GET  /health              # Service status endpoint
```

#### 🗄️ Database Models
- **User Model**: Authentication, profiles, preferences
- **Movie Model**: Enhanced with AI-friendly metadata
- **List Model**: Content categorization and curation
- **Series Model**: TV show management

#### 🧠 AI Integration Features
- **OpenAI API Integration**: Direct GPT-3.5-turbo communication
- **Context Optimization**: Smart token management for conversations
- **Content Knowledge Base**: Real-time access to movie/series database
- **Multilingual Processing**: Arabic and English language support
- **Error Handling**: Graceful fallbacks for AI service interruptions
- **Runtime Initialization**: Dynamic OpenAI setup based on API key availability

#### 🛠️ Technology Stack (Backend)
- **Node.js 20+** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.17.0** - ODM
- **OpenAI 4.20.1** - AI integration
- **JWT 9.0.2** - Authentication
- **bcrypt 6.0.0** - Password hashing
- **CORS 2.8.5** - Cross-origin requests
- **dotenv 17.2.1** - Environment management

### 🔧 Admin Dashboard Backend (`Admin-Dashboard/backend/`)

**Purpose**: Administrative API for content and user management  
**Port**: `http://localhost:5001`  
**Database**: Shared MongoDB instance  

#### 📡 Admin API Endpoints
```
Content Management:
GET  /api/content         # Get all content with admin details
POST /api/content         # Create new content
PUT  /api/content/:id     # Update content
DELETE /api/content/:id   # Delete content

User Administration:
GET  /api/admin/users     # Get all users with admin details
POST /api/admin/users     # Create user
PUT  /api/admin/users/:id # Update user
DELETE /api/admin/users/:id # Delete user

Analytics:
GET  /api/analytics       # Platform statistics
GET  /api/analytics/users # User analytics
GET  /api/analytics/content # Content performance

Settings:
GET  /api/settings        # Get platform settings
PUT  /api/settings        # Update platform settings
```

---

## 🚀 Running the Complete System

### 🔄 Development Environment Setup

#### 1. **Prerequisites**
```bash
# Required Software
Node.js 18+ (https://nodejs.org/)
MongoDB (https://www.mongodb.com/)
Git (https://git-scm.com/)

# Check versions
node --version
npm --version
mongod --version
```

#### 2. **Clone and Install Dependencies**
```bash
# Clone the repository
git clone https://github.com/MAROUANE-ED-DAHRAOUI/ChooFlex.git
cd ChooFlex

# Install Main App dependencies
cd Main-App/backend/
npm install
cd ../frontend/
npm install

# Install Admin Dashboard dependencies
cd ../../Admin-Dashboard/backend/
npm install
cd ../frontend/
npm install
```

#### 3. **Environment Configuration**
```bash
# Main App Backend (.env)
cd Main-App/backend/
cat > .env << EOF
URL_MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_TOKEN=your_tmdb_read_token
OPENAI_API_KEY=your_openai_api_key_here
EOF

# Admin Dashboard Backend (.env)
cd ../../Admin-Dashboard/backend/
cat > .env << EOF
URL_MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
EOF
```

#### 4. **Start All Services**
```bash
# Terminal 1: Main Backend (with AI Chat)
cd Main-App/backend/
npm start        # Runs on http://localhost:8000

# Terminal 2: Main Frontend
cd Main-App/frontend/
npm run dev      # Runs on http://localhost:5174

# Terminal 3: Admin Backend
cd Admin-Dashboard/backend/
npm start        # Runs on http://localhost:5001

# Terminal 4: Admin Frontend
cd Admin-Dashboard/frontend/
npm start        # Runs on http://localhost:3001
```

### 🌐 Access Points & Testing

```bash
# Customer Experience
Main Application: http://localhost:5174
- Browse movies and series
- Search with AI assistance
- Use integrated AI chatbot widget
- Manage personal watchlist

# Administration
Admin Dashboard: http://localhost:3001
- Manage content library
- View analytics and insights
- Administer user accounts
- Configure system settings

# API Endpoints
Main API: http://localhost:8000/api
Admin API: http://localhost:5001/api

# Health Checks
Main API Health: http://localhost:8000/health
Admin API Health: http://localhost:5001/health

# AI Chat Testing
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, recommend me a good movie"}'
```

---

## 🎯 Key Features Summary

### ✨ For Users
- **🎬 Netflix-like Experience**: Smooth browsing and streaming interface
- **🤖 AI Assistant**: Intelligent movie/series recommendations via chat widget
- **🔍 Smart Search**: Enhanced search with AI-powered results
- **📱 Responsive Design**: Perfect experience across all devices
- **🌍 Multilingual**: Arabic and English support throughout

### ✨ For Administrators
- **📊 Comprehensive Analytics**: Real-time platform insights
- **🎛️ Content Management**: Easy CRUD operations for media
- **👥 User Administration**: Complete user management system
- **⚙️ System Control**: Platform configuration and settings

### ✨ For Developers
- **🏗️ Clean Architecture**: Modular, maintainable codebase
- **🔧 Modern Stack**: Latest React, Node.js, and MongoDB
- **🤖 AI Integration**: OpenAI GPT-3.5-turbo seamlessly integrated
- **📡 RESTful APIs**: Well-documented, standardized endpoints
- **🔒 Security**: JWT authentication and proper validation

---

## 🛡️ Security Features

- **🔐 JWT Authentication**: Secure token-based authentication
- **🔒 Password Hashing**: bcrypt for secure password storage
- **🛡️ CORS Protection**: Configured cross-origin resource sharing
- **🔑 Environment Variables**: Secure API key management
- **✅ Input Validation**: Comprehensive request validation
- **🚫 Rate Limiting**: API protection against abuse

---

## 🎨 UI/UX Features

- **🌙 Dark Theme**: Netflix-inspired dark interface
- **✨ Smooth Animations**: CSS transitions and hover effects
- **🎯 Interactive Elements**: Hover states and visual feedback
- **📱 Mobile-First**: Responsive design for all screen sizes
- **🎪 Loading States**: Beautiful loading animations
- **🍿 Immersive Experience**: Full-screen video player support

---

## 📊 Performance Optimizations

- **⚡ Vite Build Tool**: Ultra-fast development and builds
- **🔄 React Query**: Intelligent server state caching
- **📦 Code Splitting**: Lazy loading for optimal performance
- **🖼️ Image Optimization**: Responsive images with lazy loading
- **🗜️ Bundle Optimization**: Tree shaking and minification
- **🚀 CDN Ready**: Optimized for content delivery networks

---

## 🔗 External Integrations

- **🎬 TMDB API**: Real movie and TV series data
- **🤖 OpenAI API**: GPT-3.5-turbo for AI conversations
- **🗄️ MongoDB Atlas**: Cloud database hosting
- **📁 File Storage**: Multer for media file handling

---

## 📈 Current Statistics

- **🎬 Content Library**: 183+ movies, 50+ TV series
- **👥 User Features**: Complete authentication and profile system
- **🤖 AI Integration**: Natural language content discovery
- **⚡ Performance**: <2s page load times with optimized caching
- **📱 Mobile Support**: 100% responsive design
- **🌍 Languages**: Arabic and English UI support

---

## 🎬 **ChooFlex delivers a premium streaming experience with intelligent AI assistance, making content discovery natural and enjoyable for users while providing powerful management tools for administrators.**
