# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

A comprehensive Point of Sale system designed for supermarkets. This application provides a seamless experience for managing products and processing sales, with distinct roles for administrators and cashiers.

Features
Role-Based Authentication: Secure login for Admins and Cashiers with JWT.
Admin Dashboard:
Full CRUD (Create, Read, Update, Delete) functionality for products.
View all products in an organized table.
Cashier Dashboard: A dedicated interface for processing sales.
RESTful API: A robust backend API built with Node.js and Express.
Technologies Used
Frontend:
React
Vite
React Router
Tailwind CSS
Backend:
Node.js
Express.js
Mongoose
JSON Web Token (JWT)
Database:
MongoDB
Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
Node.js and npm
MongoDB (a local instance or a cloud service like MongoDB Atlas)
Backend Setup
Navigate to the backend directory:
cd backend
Install dependencies:
npm install
Create a .env file in the backend directory and add the following environment variables:
MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_super_secret_jwt_key>
Start the backend server:
npm start
The server will run on http://localhost:5000.
Frontend Setup
Navigate to the frontend directory:
cd frontend
Install dependencies:
npm install
Start the frontend development server:
npm run dev
The application will be available at http://localhost:5173.