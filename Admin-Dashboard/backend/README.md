# ChooFlex Admin Backend

A robust admin backend API for the ChooFlex streaming platform, providing comprehensive management capabilities for users, content, analytics, and settings.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access
- 👥 **User Management** - CRUD operations, ban/unban functionality
- 🎬 **Content Management** - Movies/series management with thumbnail uploads
- 📊 **Analytics Dashboard** - Real-time stats, top content, active users
- ⚙️ **Settings Management** - Profile, notifications, preferences
- 🔄 **Fallback System** - Works independently with mock data when main backend is unavailable
- 📁 **File Upload** - Secure thumbnail upload with validation
- 🛡️ **Security** - Input validation, file type checking, CORS protection

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev

# Or start production server
npm start
```

### Environment Variables

```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MAIN_BACKEND_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/chooflex-admin
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout  
- `GET /api/auth/session` - Get current session

### User Management
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/ban` - Ban user
- `POST /api/users/:id/unban` - Unban user

### Content Management
- `GET /api/content` - List all content
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/feature` - Set as featured
- `POST /api/content/:id/thumbnail` - Upload thumbnail

### Analytics
- `GET /api/analytics/stats` - Overall platform statistics
- `GET /api/analytics/top-content` - Most viewed content
- `GET /api/analytics/active-users` - Currently active users
- `GET /api/analytics/views-over-time` - Time-series view data

### Settings
- `GET /api/settings/profile` - Get admin profile
- `PUT /api/settings/profile` - Update admin profile
- `PUT /api/settings/password` - Change password
- `GET /api/settings/notifications` - Get notifications
- `PUT /api/settings/notifications/:id/read` - Mark notification as read
- `PUT /api/settings/notifications/read-all` - Mark all as read
- `DELETE /api/settings/notifications/:id` - Delete notification

## Authentication

All endpoints except `/api/auth/login` require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## File Uploads

The thumbnail upload endpoint accepts image files (JPEG, PNG, WebP) up to 5MB. Files are stored in the `uploads/` directory and served statically.

Example upload:
```bash
curl -X POST \
  http://localhost:5001/api/content/1/thumbnail \
  -H 'Authorization: Bearer <token>' \
  -F 'thumbnail=@/path/to/image.jpg'
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Scripts

```bash
npm run dev        # Start with nodemon (auto-restart)
npm start          # Start production server
```

### Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── usersController.js
│   ├── contentController.js
│   ├── analyticsController.js
│   └── settingsController.js
├── middleware/           # Express middleware
│   └── authMiddleware.js
├── routes/              # API routes
│   ├── auth.js
│   ├── users.js
│   ├── content.js
│   ├── analytics.js
│   └── settings.js
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js           # Main application file
```

## Integration with Main Backend

The admin backend is designed to work with the main ChooFlex backend. It attempts to proxy requests to the main backend and falls back to mock data when unavailable.

Configure the main backend URL in the `.env` file:
```env
MAIN_BACKEND_URL=http://localhost:5000
```

## Security Considerations

- Change default admin credentials in production
- Use strong JWT secret (32+ characters)
- Enable HTTPS in production
- Configure proper CORS origins
- Implement rate limiting
- Add request validation middleware
- Use database instead of in-memory storage

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure strong JWT secret
3. Update admin credentials
4. Set up reverse proxy (nginx)
5. Enable SSL/TLS
6. Configure proper CORS origins
7. Set up file storage (AWS S3, etc.)
8. Implement proper logging
9. Set up monitoring

### Docker Support

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the ChooFlex streaming platform.
