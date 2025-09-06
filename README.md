# Supermarket Point of Sale (POS) System

A comprehensive Point of Sale system designed for supermarkets. This application provides a seamless experience for managing products and processing sales, with distinct roles for administrators and cashiers.

## Features

*   **Role-Based Authentication:** Secure login for Admins and Cashiers with JWT.
*   **Admin Dashboard:**
    *   Full CRUD (Create, Read, Update, Delete) functionality for products.
    *   View all products in an organized table.
*   **Cashier Dashboard:** A dedicated interface for processing sales.
*   **RESTful API:** A robust backend API built with Node.js and Express.

## Technologies Used

*   **Frontend:**
    *   React
    *   Vite
    *   React Router
    *   Tailwind CSS
*   **Backend:**
    *   Node.js
    *   Express.js
    *   Mongoose
    *   JSON Web Token (JWT)
*   **Database:**
    *   MongoDB

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js and npm
*   MongoDB (a local instance or a cloud service like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    MONGODB_URI=<your_mongodb_connection_string>
    PORT=5000
    JWT_SECRET=<your_super_secret_jwt_key>
    ```
4.  **Start the backend server:**
    ```sh
    npm start
    ```
    The server will run on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.