# ChooFlex Admin Dashboard

A modern, production-ready admin dashboard for the ChooFlex streaming platform. Built with React, featuring comprehensive content management, user analytics, and system administration capabilities.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure login with JWT token management
- **Dashboard Overview**: Real-time analytics and platform statistics
- **User Management**: Complete CRUD operations for user accounts
- **Content Management**: Movie/series upload, editing, and organization
- **Analytics**: Detailed insights into user behavior and content performance
- **Settings**: Platform configuration and API management

### Technical Features
- **Modern React**: Functional components with hooks
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Theme Support**: Light/Dark mode with CSS variables
- **Type Safety**: PropTypes validation for components
- **API Integration**: Complete REST API communication layer
- **Toast Notifications**: User-friendly feedback system
- **Protected Routes**: Authentication-based navigation

## 🛠️ Technology Stack

- **Frontend**: React 18.x
- **Routing**: React Router DOM
- **Styling**: SCSS with CSS Variables
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Toastify
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- ChooFlex backend server running

### Setup Steps

1. **Clone and Navigate**
   ```bash
   cd /path/to/ChooFlex/admin-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🌐 API Integration

The admin dashboard connects to the ChooFlex backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Token verification

### Users Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - User statistics

### Content Management
- `GET /api/movies` - Get all movies
- `GET /api/series` - Get all series
- `POST /api/movies` - Create movie
- `POST /api/series` - Create series
- `PUT /api/movies/:id` - Update movie
- `PUT /api/series/:id` - Update series
- `DELETE /api/movies/:id` - Delete movie
- `DELETE /api/series/:id` - Delete series

### Analytics
- `GET /api/analytics/overview` - Platform overview
- `GET /api/analytics/users` - User analytics
- `GET /api/analytics/content` - Content analytics
- `GET /api/analytics/revenue` - Revenue analytics

### Settings
- `GET /api/settings` - Get platform settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/api-keys` - Get API keys
- `POST /api/settings/api-keys` - Generate API key
- `DELETE /api/settings/api-keys/:id` - Revoke API key

## 🏗️ Project Structure

```
admin-dashboard/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   └── StatsCard.jsx
│   ├── pages/               # Main application pages
│   │   ├── Analytics.jsx
│   │   ├── Analytics.scss
│   │   ├── ContentManagement.jsx
│   │   ├── ContentManagement.scss
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.scss
│   │   ├── Login.jsx
│   │   ├── Login.scss
│   │   ├── Settings.jsx
│   │   ├── Settings.scss
│   │   ├── UserManagement.jsx
│   │   └── UserManagement.scss
│   ├── services/            # API communication
│   │   └── api.js
│   ├── styles/              # Global styles
│   │   └── global.scss
│   ├── utils/               # Utility functions and contexts
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── helpers.js
│   ├── App.jsx              # Main application component
│   └── index.jsx            # Application entry point
├── package.json
└── README.md
```

## 🎨 Design System

### Color Scheme
- **Primary**: #E50914 (Netflix Red)
- **Secondary**: #F5F5F1 (Light Gray)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Info**: #3B82F6 (Blue)

### Typography
- **Primary Font**: Inter, system fonts
- **Monospace**: SFMono-Regular, Consolas

### Spacing Scale
- XS: 4px, SM: 8px, MD: 12px, LG: 16px, XL: 24px, XXL: 32px

## 🔐 Authentication

### Demo Credentials
For development and testing purposes:
```
Email: admin@chooflex.com
Password: admin123
```

### Token Management
- JWT tokens stored in localStorage
- Automatic token refresh
- Protected route navigation
- Secure logout with token cleanup

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Features
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly interactions

## 🎯 Usage Guide

### Dashboard Overview
- Real-time platform statistics
- Recent activity feed
- Quick action shortcuts
- Performance metrics

### User Management
- User list with search and filters
- User profile editing
- Account status management
- Bulk operations

### Content Management
- Movie/series library overview
- Content upload and editing
- Featured content management
- Content categorization

### Analytics
- User engagement metrics
- Content performance data
- Revenue analytics
- Custom date ranges

### Settings
- Platform configuration
- API key management
- User preferences
- System maintenance

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **Server Deployment**: Apache, Nginx
3. **Container**: Docker deployment
4. **CDN**: CloudFront, CloudFlare

### Environment Variables
```env
REACT_APP_API_BASE_URL=https://api.chooflex.com/api
REACT_APP_BACKEND_URL=https://api.chooflex.com
REACT_APP_VERSION=1.0.0
```

## 🧪 Development

### Available Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from CRA

### Code Style
- ESLint configuration
- Prettier formatting
- Component naming conventions
- SCSS organization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is part of the ChooFlex streaming platform.

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (16+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **API Connection**
   - Ensure backend server is running
   - Check API base URL configuration
   - Verify CORS settings

3. **Authentication Issues**
   - Clear localStorage
   - Check JWT token validity
   - Verify login credentials

4. **Styling Issues**
   - Check SCSS compilation
   - Verify CSS variable support
   - Check responsive breakpoints

## 📞 Support

For technical support or questions:
- Check troubleshooting guide
- Review API documentation
- Contact development team

---

**ChooFlex Admin Dashboard v1.0.0**  
*Production-ready admin interface for the ChooFlex streaming platform*
