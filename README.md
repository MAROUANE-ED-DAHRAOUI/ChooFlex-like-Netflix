# 🎬 ChooFlex - Netflix-Inspired Streaming Platform

A modern, full-stack streaming platform that replicates the Netflix experience with user authentication, movie browsing, video streaming, and content management.

![ChooFlex Banner](https://via.placeholder.com/1200x400/0d1117/ffffff?text=ChooFlex+%7C+Stream+Anywhere%2C+Anytime)

## 🎯 Project Overview

ChooFlex is a comprehensive streaming platform built with modern web technologies. It provides users with an intuitive interface to browse movies and TV series, manage their watchlists, and enjoy seamless video streaming. The platform integrates with The Movie Database (TMDB) API to provide real movie and series data, creating an authentic streaming experience.

### ✨ Key Features

- **🔐 User Authentication**: Secure JWT-based registration and login system
- **🎬 Content Browsing**: Browse movies and TV series with detailed information
- **🔍 Advanced Search**: Real-time search with TMDB integration and local database fallback
- **📺 Video Streaming**: Built-in video player with full controls
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI**: Netflix-inspired dark theme with smooth animations
- **⚙️ User Settings**: Comprehensive settings page with profile management, security options, and preferences
- **📋 Content Lists**: Curated content organized by genres and categories
- **🎲 Random Discovery**: Discover new content through random recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and functional components
- **React Router DOM 7.8.0** - Client-side routing and navigation
- **Vite 7.1.2** - Fast build tool and development server
- **Sass 1.90.0** - CSS preprocessing with variables and mixins
- **Material-UI 7.3.1** - Icons and UI components
- **TanStack React Query 5.85.5** - Server state management and caching
- **Axios 1.11.0** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database for storing user and content data
- **Mongoose 8.17.0** - MongoDB object modeling for Node.js
- **JSON Web Tokens 9.0.2** - Secure authentication
- **bcrypt 6.0.0** - Password hashing and security
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.1** - Environment variable management

### External APIs
- **TMDB API** - The Movie Database for real movie and TV series data

## � Project Structure

```
ChooFlex/
├── 📂 backend/                 # Node.js Backend
│   ├── 📂 middleware/          # Custom middleware
│   │   ├── validateRegister.js # Registration validation
│   │   └── verifyToken.js      # JWT token verification
│   ├── 📂 models/              # Database models
│   │   ├── list.js             # Content lists model
│   │   ├── movie.js            # Movie/series model
│   │   └── user.js             # User model
│   ├── 📂 routes/              # API endpoints
│   │   ├── auth.js             # Authentication routes
│   │   ├── list.js             # Content lists routes
│   │   ├── movies.js           # Movies/series routes
│   │   ├── search.js           # Search functionality
│   │   ├── series.js           # TV series routes
│   │   └── users.js            # User management routes
│   ├── .env                    # Environment variables
│   ├── index.js                # Server entry point
│   └── package.json            # Backend dependencies
├── 📂 frontend/                # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 authContext/     # Authentication context
│   │   │   ├── apiCalls.js     # Auth API calls
│   │   │   ├── AuthActions.js  # Auth action types
│   │   │   ├── AuthContext.jsx # Auth context provider
│   │   │   └── AuthReducer.js  # Auth state reducer
│   │   ├── 📂 components/      # Reusable UI components
│   │   │   ├── featured/       # Featured content banner
│   │   │   ├── heroBanner/     # Hero section component
│   │   │   ├── list/           # Content list component
│   │   │   ├── listItem/       # Individual list items
│   │   │   ├── movieCard/      # Movie/series cards
│   │   │   ├── movieRow/       # Horizontal movie rows
│   │   │   ├── navbar/         # Navigation bar
│   │   │   ├── searchResults/  # Search results display
│   │   │   └── skeletonLoader/ # Loading skeleton components
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   │   ├── useApi.js       # API interaction hooks
│   │   │   ├── useDebounce.js  # Debounced input hook
│   │   │   └── usePrefetch.js  # Content prefetching
│   │   ├── 📂 pages/           # Main application pages
│   │   │   ├── home/           # Home page
│   │   │   ├── login/          # Login page
│   │   │   ├── movies/         # Movies browse page
│   │   │   ├── register/       # Registration page
│   │   │   ├── series/         # TV series page
│   │   │   ├── settings/       # User settings page
│   │   │   └── watch/          # Video player page
│   │   ├── 📂 providers/       # Context providers
│   │   ├── 📂 services/        # API service layer
│   │   ├── 📂 styles/          # Global styles and variables
│   │   └── 📂 utils/           # Utility functions
│   ├── 📂 images/              # Static assets
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
└── README.md                   # Project documentation
```

## � Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **TMDB API Key** (free account at [themoviedb.org](https://www.themoviedb.org/))

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chooflex.git
   cd ChooFlex/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   URL_MONGO=mongodb://localhost:27017/chooflex
   
   # JWT Security
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # TMDB API (Get from https://www.themoviedb.org/settings/api)
   TMDB_API_KEY=your_tmdb_api_key
   TMDB_READ_TOKEN=your_tmdb_read_access_token
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   The backend server will run on `http://localhost:8000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

### 📊 Database Setup

The application will create the necessary MongoDB collections automatically. For sample data, you can use the TMDB integration to populate movies and series.

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johnDoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "userId",
    "username": "johnDoe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token_access": "jwt_token_here"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "userId",
    "username": "johnDoe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token_access": "jwt_token_here"
}
```

### Movies & Series Endpoints

#### Get Random Movie/Series
```http
GET /api/movies/random?type=movie
```

**Query Parameters:**
- `type` (optional): `movie` or `series`

#### Find Specific Movie/Series
```http
GET /api/movies/find/:id
```

#### Get All Movies (Admin Only)
```http
GET /api/movies/all
Authorization: Bearer {token}
```

#### Create Movie/Series (Admin Only)
```http
POST /api/movies
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Movie Title",
  "desc": "Movie description",
  "img": "image_url",
  "video": "video_url",
  "year": "2024",
  "genre": "Action",
  "isSeries": false
}
```

### Series Endpoints

#### Get All Series
```http
GET /api/series
```

### Lists Endpoints

#### Get Content Lists
```http
GET /api/lists?type=movie&genre=action&populate=true
```

**Query Parameters:**
- `type` (optional): `movie` or `series`
- `genre` (optional): filter by genre
- `populate` (optional): `true` to include full movie data

#### Create List (Admin Only)
```http
POST /api/lists
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Action Movies",
  "type": "movie",
  "genre": "action",
  "content": ["movieId1", "movieId2"]
}
```

### Search Endpoint

#### Search Movies and Series
```http
GET /api/search?q=avengers
```

**Query Parameters:**
- `q`: search query string

### User Management Endpoints

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer {token}
```

#### Update User Profile
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newUsername",
  "email": "newemail@example.com"
}
```

#### Get User Statistics (Admin Only)
```http
GET /api/users/stats
Authorization: Bearer {token}
```

## 🎮 Usage Guide

### For End Users

1. **🆕 Getting Started**
   - Visit the application homepage
   - Register for a new account or login with existing credentials
   - Start browsing movies and TV series

2. **🔍 Browsing Content**
   - Use the navigation bar to switch between Movies and Series
   - Scroll through curated lists and recommendations
   - Use the search bar to find specific content

3. **📺 Watching Content**
   - Click on any movie or series card to view details
   - Click "Play" to start watching in the built-in video player
   - Use player controls for playback management

4. **⚙️ Managing Settings**
   - Access Settings from the user menu
   - Update profile information and preferences
   - Manage security settings and notifications

### For Developers

1. **🔗 API Integration**
   - All API endpoints require proper authentication (except public endpoints)
   - Use the provided Axios interceptors for automatic token handling
   - Implement proper error handling for failed requests

2. **🎨 UI Customization**
   - Modify SCSS variables in `/frontend/src/styles/variables.scss`
   - Components use modular SCSS for easy styling
   - Follow the existing design patterns for consistency

3. **🔌 Adding New Features**
   - Create new components in `/frontend/src/components/`
   - Add new pages in `/frontend/src/pages/`
   - Implement backend routes in `/backend/routes/`
   - Define database models in `/backend/models/`

## 🎨 Design Features

### Visual Design
- **Netflix-Inspired Interface**: Familiar dark theme and card-based layout
- **Responsive Grid System**: Adaptive layouts for all screen sizes
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Modern Typography**: Clean, readable fonts with proper hierarchy

### User Experience
- **Intuitive Navigation**: Easy-to-use navigation with clear visual feedback
- **Real-time Search**: Instant search results with debounced queries
- **Loading States**: Skeleton loaders for perceived performance
- **Error Handling**: User-friendly error messages and fallbacks

## 🔒 Security Features

- **JWT Authentication**: Secure token-based user authentication
- **Password Hashing**: bcrypt encryption for password security
- **Input Validation**: Server-side validation for all user inputs
- **CORS Protection**: Controlled cross-origin resource sharing
- **Environment Variables**: Secure storage of sensitive configuration

## ⚡ Performance Optimizations

- **React Query**: Intelligent caching and background data synchronization
- **Code Splitting**: Lazy loading for improved initial load times
- **Image Optimization**: Responsive images with proper sizing
- **Debounced Search**: Reduced API calls during search input
- **Prefetching**: Background loading of likely-needed content

## 🤝 Contributing

We welcome contributions to ChooFlex! Here's how you can help:

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/chooflex.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
4. **Make your changes** and commit them
   ```bash
   git commit -m 'Add some amazing new feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-new-feature
   ```
6. **Open a Pull Request** on GitHub

### Development Guidelines
- Follow the existing code style and patterns
- Write clear, descriptive commit messages
- Add appropriate comments for complex logic
- Test your changes thoroughly before submitting
- Update documentation when adding new features

### Areas for Contribution
- 🐛 Bug fixes and issue resolution
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🧪 Test coverage expansion

## 📊 Environment Variables Reference

### Backend (.env)
```env
# Required
URL_MONGO=mongodb://localhost:27017/chooflex
JWT_SECRET=your_jwt_secret_minimum_32_characters
TMDB_API_KEY=your_tmdb_api_key
TMDB_READ_TOKEN=your_tmdb_read_access_token

# Optional
PORT=8000
NODE_ENV=development
```

### Frontend
The frontend uses Vite's environment variable system. Create `.env.local` if needed:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify environment variables are set correctly
- Ensure port 8000 is not in use

**Frontend build errors:**
- Clear node_modules and reinstall dependencies
- Check for version conflicts in package.json
- Verify Vite configuration

**Authentication issues:**
- Check JWT_SECRET is set and consistent
- Verify token format in API requests
- Check user permissions for protected routes

**TMDB API issues:**
- Verify TMDB API key is valid and active
- Check API rate limits haven't been exceeded
- Ensure TMDB_READ_TOKEN is correctly configured

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 ChooFlex

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **[The Movie Database (TMDB)](https://www.themoviedb.org/)** - Movie and TV series data
- **[Material-UI](https://mui.com/)** - React UI components and icons
- **[React Query](https://tanstack.com/query)** - Server state management
- **Netflix** - Design inspiration and user experience patterns
- **Open Source Community** - Various libraries and tools that made this project possible

## 📞 Support & Contact

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-username/chooflex/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/your-username/chooflex/discussions)
- **📧 Email**: support@chooflex.com
- **💬 Discord**: [Join our community](https://discord.gg/chooflex)

---

<div align="center">
  <p><strong>Made with ❤️ by the ChooFlex team</strong></p>
  <p><em>This project is for educational purposes and is not affiliated with Netflix Inc.</em></p>
</div>