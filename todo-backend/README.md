# Todo Backend API

A comprehensive Node.js backend API for the Todo application built with Express, MongoDB, and Mongoose.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing
- **Todo Management**: Full CRUD operations for todos with advanced filtering and sorting
- **Notifications System**: Real-time notifications for todo activities
- **User Management**: User profiles, preferences, and activity tracking
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet, CORS, rate limiting, and other security best practices
- **Error Handling**: Centralized error handling with detailed error responses
- **Database**: MongoDB with Mongoose ODM for robust data modeling
- **API Documentation**: Well-documented RESTful API endpoints

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Ensure your connection string is correct in `.env`

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout user

### Todos
- `GET /api/todos` - Get all todos (with filtering, sorting, pagination)
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `GET /api/todos/stats` - Get todo statistics

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/counts` - Get notification counts
- `GET /api/notifications/:id` - Get single notification
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/read` - Delete all read notifications

### Users
- `GET /api/users/dashboard` - Get user dashboard data
- `GET /api/users/activity` - Get user activity summary
- `PUT /api/users/preferences` - Update user preferences
- `DELETE /api/users/account` - Deactivate user account

### Health Check
- `GET /health` - API health check

## 🔧 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the todo app project",
    "priority": "High",
    "dueDate": "2024-12-31",
    "tags": ["work", "urgent"]
  }'
```

### Get Todos with Filters
```bash
curl "http://localhost:5000/api/todos?status=pending&priority=High&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  preferences: {
    theme: String,
    notifications: Object,
    defaultPriority: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Todo Model
```javascript
{
  title: String,
  description: String,
  status: String (pending/in-progress/completed),
  priority: String (Low/Medium/High),
  dueDate: Date,
  completed: Boolean,
  completedAt: Date,
  tags: [String],
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  title: String,
  message: String,
  type: String (info/success/warning/error/reminder),
  read: Boolean,
  readAt: Date,
  priority: String (low/medium/high),
  category: String (todo/system/reminder/achievement),
  relatedTodo: ObjectId (ref: Todo),
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Secure error responses without sensitive data leakage

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development

### Code Structure
```
todo-backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── tests/           # Test files
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Adding New Features
1. Create model in `models/` directory
2. Add routes in `routes/` directory
3. Add validation in `middleware/validation.js`
4. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs for debugging

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### Pagination Response
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "data": [ ... ]
}
```