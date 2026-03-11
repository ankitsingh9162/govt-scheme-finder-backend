# Government Scheme Finder - Backend

## Quick Start Commands

```bash
# Install dependencies
npm install

# Run server (development mode with auto-restart)
npm run dev

# Run server (production mode)
npm start

# Add sample schemes to database
npm run seed
```

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   - Add your MongoDB Atlas connection string
   - Add a secret key for JWT

3. **Run the seed script** to add sample schemes:
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Schemes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get scheme by ID
- `GET /api/schemes/user/eligible` - Get eligible schemes (🔒 Protected)
- `POST /api/schemes/compare` - Compare schemes
- `POST /api/schemes/create` - Create scheme (🔒 Protected)

### User
- `GET /api/user/profile` - Get profile (🔒 Protected)
- `PUT /api/user/profile` - Update profile (🔒 Protected)
- `POST /api/user/save-scheme/:id` - Save scheme (🔒 Protected)
- `DELETE /api/user/save-scheme/:id` - Unsave scheme (🔒 Protected)
- `GET /api/user/saved-schemes` - Get saved schemes (🔒 Protected)

**🔒 Protected** = Requires login token in headers

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Need Help?

Check `SETUP_GUIDE.md` for detailed setup instructions.
