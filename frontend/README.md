# ChooFlex Frontend

A modern Netflix-inspired streaming platform frontend built with React, Vite, and Material-UI.

## 🚀 Features

- **Modern React Architecture**: Built with React 19 and functional components
- **Responsive Design**: Mobile-first approach with Sass styling
- **Authentication**: Secure JWT-based authentication flow
- **Content Discovery**: Browse movies and TV series with search functionality
- **Comprehensive Settings**: Complete user settings and preferences management
- **Theme Support**: Light, dark, and system theme options
- **Real-time Search**: Debounced search with instant results
- **Video Streaming**: Built-in video player integration

## 🛠️ Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool & Dev Server
- **React Router DOM** - Client-side Routing
- **Sass** - CSS Preprocessing
- **Material-UI Icons** - Icon Library
- **Axios** - HTTP Client
- **Context API** - State Management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── navbar/         # Navigation component
│   ├── heroBanner/     # Hero section component
│   ├── movieCard/      # Movie/series card component
│   ├── movieRow/       # Horizontal scrolling row
│   ├── list/           # Content list wrapper
│   ├── listItem/       # Individual list items
│   ├── featured/       # Featured content section
│   └── searchResults/  # Search results display
├── pages/              # Main application pages
│   ├── home/          # Home dashboard
│   ├── movies/        # Movies catalog
│   ├── series/        # TV series catalog
│   ├── settings/      # User settings & preferences
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   └── watch/         # Video player page
├── authContext/       # Authentication context & logic
├── hooks/            # Custom React hooks
├── services/         # API service layer
├── utils/           # Utility functions & helpers
└── styles/          # Global styles & Sass variables
```

## 🎨 Design System

### Color Palette
- **Primary**: Netflix Red (#e50914)
- **Background**: Dark themes (#181818, #232323)
- **Text**: White and gray variants
- **Success**: Green (#22c55e)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 900
- **Responsive Scaling**: clamp() functions for fluid typography

### Responsive Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1400px

## ⚙️ Settings Features

The Settings page includes comprehensive user management:

### Profile Settings
- Edit personal information (name, username, email, phone)
- Profile picture upload/change
- Password management with security validation
- Account deletion option

### Privacy & Security
- Two-factor authentication toggle
- Profile visibility controls (public/private)
- Active sessions management
- Logout from other devices

### Notifications
- Email notification preferences
- Push notification settings
- In-app notification controls

### Appearance
- Theme selection (light/dark/system)
- Language preferences
- Accessibility options

### App Preferences
- Content autoplay settings
- Safe mode toggle
- Data usage preferences

### Account Management
- Data export functionality
- Account statistics
- Subscription information
- Support and help links

## 🔧 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env.local` file (optional):
```env
VITE_API_URL=http://localhost:8000/api
```

### Development Server
The development server runs on `http://localhost:5173` by default.

## 🧩 Key Components

### Authentication Flow
- Context-based state management
- Persistent login with localStorage
- Protected routes with React Router
- Automatic token refresh handling

### Search Functionality
- Debounced search with custom hook
- Real-time results display
- Search history (future feature)
- Advanced filtering options

### Video Player Integration
- Custom video player controls
- Fullscreen support
- Progress tracking
- Quality selection

### Settings Management
- Form validation with custom utilities
- Real-time preference updates
- Local storage persistence
- Theme switching with CSS variables

## 📱 Mobile Responsiveness

- **Mobile-First Design**: Built with mobile devices as the primary target
- **Touch-Friendly**: Large touch targets and gesture support
- **Adaptive Layouts**: Components adapt to screen size
- **Performance Optimized**: Lazy loading and code splitting

## 🎯 Performance Features

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images with proper loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Service worker for offline support (future)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or similar
npm run deploy
```

## 🤝 Contributing

1. Follow the established code structure
2. Use proper TypeScript types (future migration)
3. Write meaningful commit messages
4. Test your changes across devices
5. Update documentation as needed

## 📄 License

This project is part of the ChooFlex application suite. See the main README for license information.
