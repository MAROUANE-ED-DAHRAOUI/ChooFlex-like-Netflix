# ChooFlex - Netflix Clone

A modern, feature-rich Netflix-inspired streaming platform built with React and Node.js.

## 🎯 Features

### Core Features
- **User Authentication**: Secure login/register system with JWT tokens
- **Browse Content**: Movies and TV series with detailed information
- **Search Functionality**: Advanced search with real-time results
- **Video Streaming**: Built-in video player with controls
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### Content Management
- **TMDB Integration**: Real movie/series data from The Movie Database
- **Content Lists**: Curated lists by genre and category
- **Random Discovery**: Discover content through random recommendations
- **Genre Filtering**: Browse content by specific genres

### User Experience
- **Modern UI**: Netflix-inspired dark theme design
- **Smooth Animations**: Fluid transitions and hover effects
- **Loading States**: Skeleton loading for better UX
- **Error Handling**: Comprehensive error management

### Settings & Personalization
- **Profile Management**: Edit personal information and avatar
- **Security Settings**: Change password, 2FA, privacy controls
- **Appearance**: Light/dark/system theme options
- **Notifications**: Customizable notification preferences
- **Data Export**: Export personal data and preferences

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Sass** - CSS preprocessing
- **Material-UI Icons** - Icon library
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📱 Project Structure

```
ChooFlex/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── navbar/      # Navigation bar
│   │   │   ├── heroBanner/  # Hero section
│   │   │   ├── movieCard/   # Movie/series cards
│   │   │   ├── movieRow/    # Horizontal movie rows
│   │   │   └── searchResults/ # Search results display
│   │   ├── pages/           # Main pages
│   │   │   ├── home/        # Home page
│   │   │   ├── movies/      # Movies page
│   │   │   ├── series/      # TV series page
│   │   │   ├── settings/    # Settings page
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   └── watch/       # Video player page
│   │   ├── authContext/     # Authentication context
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global styles and variables
│   └── package.json
└── backend/                 # Node.js backend
    ├── models/              # Database models
    ├── routes/              # API routes
    ├── middleware/          # Custom middleware
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- TMDB API key (for movie data)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChooFlex/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   URL_MONGO=mongodb://localhost:27017/chooflex
   JWT_SECRET=your_jwt_secret_key
   TMDB_API_KEY=your_tmdb_api_key
   TMDB_READ_TOKEN=your_tmdb_read_token
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Database Setup

1. **Import sample data** (optional)
   ```bash
   cd backend
   node importTMDB.js
   ```

## 🎮 Usage

### For Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Content**: Explore movies and TV series on the home page
3. **Search**: Use the search bar to find specific content
4. **Watch**: Click on any movie/series to start watching
5. **Settings**: Customize your preferences in the settings page

### For Developers
1. **API Endpoints**: Available at `http://localhost:8000/api/`
2. **Database**: MongoDB collections for users, movies, and lists
3. **Authentication**: JWT tokens for secure API access

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies & Series
- `GET /api/movies/random` - Get random movie/series
- `GET /api/movies/find/:id` - Get specific movie/series
- `GET /api/series` - Get all TV series

### Lists & Search
- `GET /api/lists` - Get content lists
- `GET /api/search` - Search movies and series

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

## 🎨 Design Features

### Visual Design
- **Netflix-inspired Interface**: Familiar dark theme and layout
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Loading Skeletons**: Better perceived performance

### User Experience
- **Intuitive Navigation**: Easy-to-use navigation system
- **Quick Search**: Instant search with debounced queries
- **Error Boundaries**: Graceful error handling
- **Accessibility**: Keyboard navigation and screen reader support

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Responsive images with proper sizing
- **Debounced Search**: Reduced API calls on search
- **Caching**: Browser caching for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDB**: Movie and TV series data
- **Material-UI**: Icon library
- **React Community**: Excellent documentation and resources
- **MongoDB**: Flexible database solution

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Note**: This is a demonstration project for educational purposes. It is not affiliated with Netflix Inc.