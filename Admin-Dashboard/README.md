# 🛠️ ChooFlex Admin Dashboard

## 📋 Overview

The **Admin Dashboard** is the comprehensive management interface for the ChooFlex streaming platform. It provides powerful tools for content management, user administration, analytics, and system configuration.

## 🏗️ Architecture

```
Admin-Dashboard/
├── 📂 backend/          # Admin API Server (Port: 5001)
├── 📂 frontend/         # React Admin Interface (Port: 3001)
└── README.md           # This documentation
```

## 🛠️ Technology Stack

### Frontend (Port: 3001)
- **React 18.2.0** - Component-based UI library
- **Create React App 5.0.1** - Zero-configuration build toolchain
- **React Router DOM 6.22.3** - Single-page application routing
- **React Icons 5.0.1** - Comprehensive icon library
- **Recharts 2.15.4** - Data visualization and charts
- **React Toastify 10.0.4** - User-friendly notifications
- **Sass 1.69.5** - Advanced CSS preprocessing
- **Axios 1.6.0** - HTTP client for API communication

### Backend (Port: 5001)
- **Express.js 4.18.2** - Web application framework
- **Multer 1.4.5** - File upload handling middleware
- **bcryptjs 2.4.3** - Password encryption
- **jsonwebtoken 9.0.0** - JWT token management
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment configuration

## ✨ Key Features

### 📊 Dashboard & Analytics
- **📈 Overview Dashboard**: Real-time statistics and key metrics
- **📊 Advanced Analytics**: User behavior and content performance analysis
- **📈 Data Visualization**: Interactive charts and graphs with Recharts
- **🎯 KPI Monitoring**: Track important business metrics
- **📱 Responsive Analytics**: Mobile-optimized dashboard views

### 🎬 Content Management
- **📋 Content Library**: Complete CRUD operations for movies and series
- **➕ Add Content**: Create new content with rich form validation
- **✏️ Edit Content**: Update existing content with modal interfaces
- **🗑️ Delete Content**: Safe removal with confirmation dialogs
- **⭐ Feature Management**: Toggle featured status for content
- **🔍 Advanced Search**: Multi-parameter filtering and search
- **📊 Content Analytics**: Performance metrics for individual content

### 👥 User Management
- **👤 User Profiles**: View and manage user accounts
- **📊 User Analytics**: Track user behavior and engagement
- **🛡️ Role Management**: Admin and user role assignments
- **📈 User Statistics**: Registration trends and active users
- **🚫 Account Actions**: Suspend, activate, or delete user accounts

### 🔧 System Management
- **⚙️ Settings**: System configuration and preferences
- **📁 File Upload**: Image and media management with Multer
- **🔐 Security**: Admin authentication and access control
- **📊 System Health**: Monitor application performance
- **🌐 API Management**: Manage connections to main backend

## 🚀 Quick Start

### Prerequisites
```bash
# Required
- Node.js 18+
- Access to Main-App backend (Port: 8000)
- Admin credentials
```

### Backend Setup
```bash
cd Admin-Dashboard/backend/

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Configure environment variables

# Start admin API server
npm start
# Server runs on http://localhost:5001
```

### Frontend Setup
```bash
cd Admin-Dashboard/frontend/

# Install dependencies
npm install

# Start development server
npm start
# Dashboard runs on http://localhost:3001
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/admin-login    # Admin authentication
POST /api/auth/refresh        # Token refresh
GET  /api/auth/verify         # Verify admin status
```

### Content Management
```
GET    /api/content           # Get all content with pagination
POST   /api/content           # Create new content
PUT    /api/content/:id       # Update existing content
DELETE /api/content/:id       # Delete content
GET    /api/content/stats     # Content statistics
```

### User Management
```
GET    /api/users             # Get all users with filters
GET    /api/users/:id         # Get specific user details
PUT    /api/users/:id         # Update user information
DELETE /api/users/:id         # Delete user account
GET    /api/users/analytics   # User analytics data
```

### Analytics
```
GET /api/analytics/overview   # Dashboard overview statistics
GET /api/analytics/users      # User engagement analytics
GET /api/analytics/content    # Content performance metrics
GET /api/analytics/trends     # Platform usage trends
```

### File Management
```
POST /api/upload              # Upload images/media files
GET  /api/files               # List uploaded files
DELETE /api/files/:id         # Delete uploaded files
```

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── Button.jsx         # Reusable button component
│   ├── Header.jsx         # Dashboard header with navigation
│   ├── Layout.jsx         # Main layout wrapper
│   ├── LoadingSpinner.jsx # Loading state indicators
│   ├── Modal.jsx          # Modal dialog component
│   ├── ProtectedRoute.jsx # Route authentication guard
│   ├── Sidebar.jsx        # Navigation sidebar
│   └── StatsCard.jsx      # Metric display cards
├── pages/
│   ├── Analytics.jsx      # Analytics dashboard
│   ├── ContentManagement.jsx # Content CRUD interface
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Login.jsx          # Admin authentication
│   ├── Settings.jsx       # System settings
│   └── UserManagement.jsx # User administration
├── services/
│   └── api.js             # API configuration and methods
├── styles/
│   └── global.scss        # Global stylesheet
└── utils/
    ├── AuthContext.jsx    # Authentication context
    ├── helpers.js         # Utility functions
    └── ThemeContext.jsx   # Theme management
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based admin access
- **Role-based Access Control**: Different permission levels
- **Session Management**: Automatic token refresh
- **Secure Routes**: Protected admin-only pages

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure file handling with type validation
- **CORS Configuration**: Properly configured cross-origin policies
- **Error Handling**: Secure error messages without sensitive data

## 📊 Analytics Features

### Dashboard Metrics
- **User Statistics**: Total users, active users, new registrations
- **Content Metrics**: Total content, featured items, view counts
- **System Performance**: API response times, error rates
- **Engagement Analytics**: User activity patterns and trends

### Data Visualization
- **Interactive Charts**: Line charts, bar charts, pie charts
- **Real-time Updates**: Live data with automatic refresh
- **Customizable Views**: Filter by date ranges and categories
- **Export Capabilities**: Download reports and analytics data

## 🎯 Development Commands

```bash
# Frontend
npm start            # Start development server
npm run build        # Build for production
npm test             # Run test suite
npm run eject        # Eject from CRA (if needed)

# Backend
npm start            # Start admin API server
npm run dev          # Start with nodemon
npm test             # Run backend tests
```

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5001
MAIN_API_URL=http://localhost:8000
JWT_SECRET=your_admin_jwt_secret
UPLOAD_PATH=./uploads
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_MAIN_API_URL=http://localhost:8000/api
```

## 🎨 UI/UX Features

### Design System
- **Consistent Styling**: Unified color scheme and typography
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Dark Theme**: Professional dark mode interface
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and progress indicators

### User Experience
- **Intuitive Navigation**: Clear information architecture
- **Quick Actions**: Efficient workflows for common tasks
- **Real-time Feedback**: Instant notifications and confirmations
- **Error Handling**: User-friendly error messages
- **Bulk Operations**: Efficient management of multiple items

## 📱 Responsive Design

- **Desktop First**: Optimized for admin workstations
- **Tablet Support**: Functional interface on tablets
- **Mobile Access**: Essential functions available on mobile
- **Large Displays**: Efficient use of wide screens

## 🔗 Integration Points

- **Main-App Backend**: User and content data synchronization
- **File Storage**: Image and media upload management
- **Analytics Services**: Data collection and processing
- **Authentication System**: Secure admin access management

## 📊 Current Capabilities

- **Content Management**: Full CRUD for 233+ content items
- **User Administration**: Complete user lifecycle management
- **Analytics Dashboard**: 15+ key performance indicators
- **File Management**: Secure upload and storage system
- **Security Features**: Multi-layered protection system

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of dashboard sections
- **Data Caching**: Intelligent caching of frequently accessed data
- **Optimized Queries**: Efficient database operations
- **Bundle Optimization**: Minimized JavaScript bundles
- **Image Optimization**: Compressed and responsive images

---

## 🤝 Contributing

1. Ensure admin access credentials
2. Follow coding standards and conventions
3. Test all CRUD operations thoroughly
4. Validate responsive design across devices
5. Submit pull requests with detailed descriptions

## 📄 License

This project is part of the ChooFlex streaming platform ecosystem.

---

**🛠️ The Admin Dashboard provides comprehensive management tools for maintaining and optimizing the ChooFlex streaming platform with professional-grade analytics and administration capabilities.**
