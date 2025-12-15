# Alumni System Backend

Express.js + MongoDB backend for the Alumni Management System.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

👉 **IMPORTANT: Where to insert MongoDB and JWT credentials**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   - **MONGO_URI**: Paste your MongoDB Atlas connection string here
     - Format: `mongodb+srv://username:password@cluster.mongodb.net/alumni-db?retryWrites=true&w=majority`
     - Get this from your MongoDB Atlas dashboard → Connect → Connect your application
   
   - **JWT_SECRET**: Create a strong random string for JWT token signing
     - Example: `my-super-secret-jwt-key-12345`
     - Use a secure random string generator in production
   
   - **PORT**: Backend server port (default: 4000)

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Alumni
- `GET /alumni` - Get all approved alumni (authenticated)
- `GET /alumni/pending` - Get pending approvals (admin only)
- `PUT /alumni/approve/:id` - Approve alumni (admin only)
- `PUT /alumni/reject/:id` - Reject alumni (admin only)
- `PUT /alumni/:id` - Update alumni (admin only)
- `DELETE /alumni/:id` - Delete alumni (admin only)

### Events
- `GET /events` - Get all events
- `POST /events` - Create event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

### Jobs
- `GET /jobs` - Get all jobs
- `POST /jobs` - Create job (admin only)
- `PUT /jobs/:id` - Update job (admin only)
- `DELETE /jobs/:id` - Delete job (admin only)

### Announcements
- `GET /announcements` - Get all announcements
- `POST /announcements` - Create announcement (admin only)
- `PUT /announcements/:id` - Update announcement (admin only)
- `DELETE /announcements/:id` - Delete announcement (admin only)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Default Admin Account

After first setup, you can create an admin account by setting `role: "admin"` directly in MongoDB or through the signup route and then updating the role manually.

---

**Note**: Ensure your `.env` file is created and filled before starting the server!

