# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Supermarket POS System (React + Vite)

A comprehensive Point of Sale (POS) system designed for supermarkets. This application provides a seamless experience for managing products and processing sales, with distinct roles for Administrators and Cashiers.

Features

Role-Based Authentication
Secure login for Admins and Cashiers using JSON Web Tokens (JWT).

Admin Dashboard

Full CRUD (Create, Read, Update, Delete) operations for products.

View all products in an organized table with search and filters.

Cashier Dashboard

Dedicated interface for processing sales.

Easy product lookup and bill generation.

Sales Management

Record transactions with item details, quantities, and totals.

Real-time updates to inventory after sales.

RESTful API
Backend powered by Node.js and Express for scalability and robustness.

Scalable Design
Built with future enhancements in mind: reporting, supplier management, and inventory alerts.

Technologies Used

Frontend

React

Vite

React Router

Tailwind CSS

Backend

Node.js

Express.js

Mongoose

JSON Web Token (JWT)

Database

MongoDB

Getting Started

Follow these steps to run the project locally.

Prerequisites

Node.js and npm

MongoDB (local instance or cloud service like MongoDB Atlas)

Backend Setup
cd backend
npm install


Create a .env file inside backend/ and add:

MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_super_secret_jwt_key>


Start the backend:

npm start


Runs on: http://localhost:5000

Frontend Setup
cd frontend
npm install
npm run dev


Runs on: http://localhost:5173

Folder Structure (Suggested)
/project-root
  /backend
    /controllers
    /models
    /routes
    server.js
  /frontend
    /src
      /components
      /pages
        AdminDashboard.jsx
        CashierDashboard.jsx
      /context
      /services
    vite.config.js