import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/pos_system'; // Replace with your actual MongoDB URI if needed
mongoose.connect(MONGO_URI)
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.error('MongoDB connection error:', err));
import express from 'express';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
