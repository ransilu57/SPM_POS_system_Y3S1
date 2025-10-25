# 🚀 Quick Start Guide - POS System

## How to Run the Application

### Backend (Terminal 1)

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not already installed)
npm install

# Start the backend server
node app.js
```

**Expected Output:**
```
MongoDB connected...
Server running on port 5000
```

---

### Frontend (Terminal 2)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

## 🧪 Testing the Application

### 1. Login as Admin
1. Open browser: `http://localhost:3000`
2. Use credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Click "Login"
4. You should see the Admin Dashboard

### 2. Add a Product
1. Click "Add New Product" button
2. Fill in:
   - Product Name: "Test Product"
   - Description: "Test Description"
   - Quantity: 100
   - Unit Price: 25.99
   - Image: (optional - upload an image)
3. Click "Add Product"
4. You should see success message and redirect to dashboard

### 3. Create a Cashier
1. Click "Manage Cashiers" button
2. Click "+ Add New Cashier"
3. Fill in:
   - Username: "cashier1"
   - Email: "cashier1@example.com"
   - Password: "Cashier123!" (must have uppercase, lowercase, number)
4. Click "Create Cashier"
5. You should see success message

### 4. Test Cashier Login
1. Logout from admin account
2. Login with cashier credentials:
   - Username: `cashier1`
   - Password: `Cashier123!`
3. You should see the Cashier Dashboard (POS interface)
4. Try adding products to cart and checking out

---

## 🔍 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Check your `.env` file has correct `MONGO_URI`
- Make sure MongoDB is running

### Issue: "JWT_SECRET not defined"
**Solution**: 
- Check your `.env` file has `JWT_SECRET=your-secret-key`

### Issue: "CORS error"
**Solution**: 
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check backend `app.js` has CORS enabled

### Issue: "401 Unauthorized"
**Solution**: 
- Check if you're logged in
- Check if token exists in localStorage (F12 → Application → Local Storage)
- Try logging out and logging back in

### Issue: "Cannot login as admin"
**Solution**: 
- Make sure you use EXACT credentials: `admin` / `admin123`
- Check backend console for errors

---

## 📁 Project Structure

```
POS_system/
├── backend/
│   ├── app.js                    # Main server file
│   ├── controllers/              # Request handlers
│   ├── models/                   # MongoDB schemas
│   ├── middleware/               # Custom middleware
│   ├── routes/                   # API routes
│   └── .env                      # Environment variables
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main app component
    │   ├── pages/               # Page components
    │   ├── components/          # Reusable components
    │   └── utils/               # Utility functions (API)
    └── package.json
```

---

## 🌐 Available Endpoints

### Base URL: `http://localhost:5000/api`

**Authentication:**
- POST `/auth/login` - Login
- POST `/auth/register` - Register new user (admin only)
- POST `/auth/logout` - Logout

**Products:**
- GET `/products` - Get all products
- GET `/products/:id` - Get single product
- POST `/products` - Create product (admin only)
- PUT `/products/:id` - Update product (admin only)
- DELETE `/products/:id` - Delete product (admin only)

**Cashiers:**
- GET `/cashiers` - Get all cashiers (admin only)
- PUT `/cashiers/:id` - Update cashier (admin only)
- DELETE `/cashiers/:id` - Delete cashier (admin only)

**Dashboard:**
- GET `/dashboard/stats` - Get statistics

---

## 🎯 Key Features Implemented

✅ JWT Authentication with token blacklisting  
✅ Role-based access control (Admin/Cashier)  
✅ Product CRUD with image upload  
✅ Cashier management  
✅ POS interface for cashiers  
✅ Protected routes  
✅ Centralized API utilities  
✅ Password strength validation  
✅ Responsive UI with Tailwind CSS  

---

## 💾 Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/pos_system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

---

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Vite (build tool)

---

## 📞 Need Help?

Check these files for more information:
- `INTEGRATION_COMPLETE.md` - Detailed integration documentation
- `backend/IMPLEMENTATION_STATUS.md` - Backend implementation guide
- Browser Console (F12) - For frontend errors
- Backend Terminal - For backend errors

---

**Happy Testing! 🎉**
