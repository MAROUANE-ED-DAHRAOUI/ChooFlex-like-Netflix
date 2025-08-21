# ChooFlex Frontend Applications

This directory contains all frontend applications for the ChooFlex streaming platform.

## Structure

```
frontend/
├── main-app/                 # Main ChooFlex streaming application
│   ├── src/                  # React source code
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.js        # Vite configuration
│   ├── index.html            # Main HTML template
│   └── ...
└── admin-dashboard-app/      # Admin dashboard application
    ├── src/                  # React source code
    ├── package.json          # Dependencies and scripts
    ├── public/               # Public assets
    ├── build/                # Production build
    └── ...
```

## Applications

### 1. Main App (`/main-app/`)
- **Purpose**: Customer-facing streaming application
- **Technology**: React + Vite
- **Features**: Movie/series streaming, user authentication, search, watchlists
- **Start**: `cd main-app && npm start`
- **Build**: `cd main-app && npm run build`

### 2. Admin Dashboard (`/admin-dashboard-app/`)
- **Purpose**: Administrative interface for platform management
- **Technology**: React + Create React App
- **Features**: User management, content management, analytics, settings
- **Start**: `cd admin-dashboard-app && npm start`
- **Build**: `cd admin-dashboard-app && npm run build`

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Quick Start

1. **Main Application**
   ```bash
   cd main-app
   npm install
   npm run dev
   ```

2. **Admin Dashboard**
   ```bash
   cd admin-dashboard-app
   npm install
   npm start
   ```

### Environment Setup

Each application has its own `.env` file with specific configuration:

- `main-app/.env` - Main application environment variables
- `admin-dashboard-app/.env` - Admin dashboard environment variables

### Backend Dependencies

Both frontend applications connect to the ChooFlex backend services:
- Main backend: `/backend/`
- Admin dashboard backend: `/admin-dashboard-backend/`

Make sure the corresponding backend services are running before starting the frontend applications.

## Deployment

### Production Builds

1. **Main App**
   ```bash
   cd main-app
   npm run build
   # Output: dist/
   ```

2. **Admin Dashboard**
   ```bash
   cd admin-dashboard-app
   npm run build
   # Output: build/
   ```

### Deployment Structure
```
Production Deploy:
├── chooflex.com/              # Main app (from main-app/dist/)
└── admin.chooflex.com/        # Admin dashboard (from admin-dashboard-app/build/)
```

## Documentation

- **Main App**: See `main-app/README.md`
- **Admin Dashboard**: See `admin-dashboard-app/README.md`

## Support

For technical questions or issues, refer to the individual application README files or contact the development team.
