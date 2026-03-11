# 🚀 Backend Setup Guide - Government Scheme Finder

## ✅ What You Have Now

Complete backend with:
- ✅ User Authentication (Register/Login)
- ✅ Profile Management
- ✅ Scheme APIs with Eligibility Logic
- ✅ Save/Unsave Schemes
- ✅ Compare Schemes
- ✅ 10 Sample Schemes Data

---

## 📁 Folder Structure

```
backend/
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── models/
│   ├── User.js                  # User database model
│   └── Scheme.js                # Scheme database model
├── controllers/
│   ├── authController.js        # Login/Register logic
│   ├── schemeController.js      # Scheme APIs + Eligibility
│   └── userController.js        # Profile management
├── routes/
│   ├── authRoutes.js           # Auth endpoints
│   ├── schemeRoutes.js         # Scheme endpoints
│   └── userRoutes.js           # User endpoints
├── middleware/
│   └── authMiddleware.js       # JWT verification
└── data/
    └── sampleSchemes.json      # Sample scheme data
```

---

## 🔧 Setup Steps (Follow Carefully)

### Step 1: Copy All Files

1. Copy the entire `backend` folder I created
2. Paste it in your `government-scheme-finder` folder
3. Open VS Code in the `backend` folder

### Step 2: Install Dependencies

Open terminal in VS Code and run:

```bash
npm install
```

**Wait 30-60 seconds** until you see "added X packages"

---

### Step 3: Setup MongoDB Atlas (5 minutes)

#### A. Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google (easiest)
3. Choose **FREE tier** (M0 Sandbox)

#### B. Create Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select **AWS** provider
4. Choose **Mumbai (ap-south-1)** region (closest to India)
5. Cluster Name: keep default or name it "SchemeFinderDB"
6. Click "Create"

**Wait 3-5 minutes** for cluster to deploy.

#### C. Create Database User
1. On the left, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin`
5. Password: Create a strong password (SAVE THIS!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

#### D. Whitelist IP Address
1. On the left, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

#### E. Get Connection String
1. Go back to "Database" on left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT:** Replace `<password>` with your actual password

---

### Step 4: Create .env File

1. In VS Code, in `backend` folder, create a new file: `.env`
2. Copy this content:

```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/govt-scheme-finder?retryWrites=true&w=majority
JWT_SECRET=mysecretkey12345changethis
PORT=5000
NODE_ENV=development
```

3. **Replace** the MongoDB URI with YOUR connection string from Step 3E
4. **Replace** YOUR_PASSWORD with your actual password
5. **Change** JWT_SECRET to any random string

**Example of correct .env:**
```env
MONGODB_URI=mongodb+srv://admin:MyPass123@cluster0.abc123.mongodb.net/govt-scheme-finder?retryWrites=true&w=majority
JWT_SECRET=jhgfd87y3edhj23edh
PORT=5000
NODE_ENV=development
```

---

### Step 5: Test the Server

Run this command:

```bash
npm run dev
```

**You should see:**
```
🚀 Server is running on port 5000
✅ MongoDB Connected Successfully!
```

**If you see this = SUCCESS! 🎉**

---

## 🧪 Test Your APIs

### Use Postman (or Thunder Client VS Code extension)

#### 1. Test Server
- **Method:** GET
- **URL:** `http://localhost:5000/`
- **Expected:** `{ "message": "Government Scheme Finder API is running!" }`

#### 2. Register User
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/register`
- **Body (JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```
- **Expected:** User object + token

#### 3. Login User
- **Method:** POST
- **URL:** `http://localhost:5000/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
- **Expected:** User object + token

#### 4. Get All Schemes
- **Method:** GET
- **URL:** `http://localhost:5000/api/schemes`
- **Expected:** Empty array (we'll add schemes next)

---

## 📊 Add Sample Schemes to Database

### Option 1: Using MongoDB Compass (GUI - Easier)

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Install it
3. Connect using your MongoDB URI
4. Create database: `govt-scheme-finder`
5. Create collection: `schemes`
6. Import JSON: Go to Collection → Add Data → Import JSON
7. Select `backend/data/sampleSchemes.json`
8. Click Import

### Option 2: Using Code (I'll create a script)

I can create a script that automatically adds all schemes when you run it.

---

## 🎯 Next Steps

After backend is working:

1. **Test all APIs** in Postman
2. **Add more schemes** (aim for 50+)
3. **Start frontend** (React app)
4. **Connect frontend to backend**

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot connect to MongoDB"
- Check your .env file
- Make sure password is correct
- Make sure IP whitelist is set to 0.0.0.0/0

### Issue 2: "Port 5000 already in use"
- Change PORT in .env to 5001
- Or kill the process using port 5000

### Issue 3: "Module not found"
- Run `npm install` again
- Make sure you're in backend folder

### Issue 4: "nodemon not found"
- Run `npm run start` instead of `npm run dev`
- Or install nodemon globally: `npm install -g nodemon`

---

## 📝 API Endpoints Reference

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Scheme Routes
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get single scheme
- `GET /api/schemes/user/eligible` - Get eligible schemes (requires login)
- `POST /api/schemes/compare` - Compare two schemes
- `POST /api/schemes/create` - Create new scheme (requires login)

### User Routes
- `GET /api/user/profile` - Get user profile (requires login)
- `PUT /api/user/profile` - Update profile (requires login)
- `POST /api/user/save-scheme/:schemeId` - Save scheme (requires login)
- `DELETE /api/user/save-scheme/:schemeId` - Unsave scheme (requires login)
- `GET /api/user/saved-schemes` - Get saved schemes (requires login)

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] .env file configured
- [ ] npm install completed
- [ ] Server running without errors
- [ ] MongoDB connected successfully
- [ ] Register API working
- [ ] Login API working
- [ ] Sample schemes added to database

**Once all checked = Backend is READY!** 🚀

---

## Need Help?

If you face any error:
1. Read the error message carefully
2. Check the common issues section above
3. Copy the exact error and ask me

**Let's make this work! 💪**
