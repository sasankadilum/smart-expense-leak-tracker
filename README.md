# Smart Expense Leak Tracker 🚀

A modern, responsive web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that not only tracks daily expenses but intelligently analyzes spending habits to detect "expense leaks" and micro-transactions. 

Developed as a 4-Day Sprint Project for the Software Engineering Internship.

## ✨ Key Features

* **Smart Insights Engine:** A custom backend rule-based algorithm that categorizes expenses, detects overspending thresholds, flags 'micro-leaks', and provides actionable recommendations.
* **Modern UI/UX:** Mobile-first, fully responsive design built entirely with **Tailwind CSS**.
* **Dynamic Filtering:** Real-time expense filtering capabilities (Today, This Month, All Time) with dynamic total calculations.
* **Secure Authentication:** User registration and login secured with JWT (JSON Web Tokens).
* **Core CRUD Operations:** Users can easily add, view, and delete their daily transactions.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcryptjs

## ⚙️ How to Run the Project Locally

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 2. Clone the Repository
\`\`\`bash
git clone https://github.com/sasankadilum/smart-expense-leak-tracker.git
cd smart-expense-leak-tracker
\`\`\`

### 3. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.
\`\`\`bash
cd backend
npm install
\`\`\`
**Environment Variables:**
Create a \`.env\` file in the \`backend\` directory and add the following details:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

### 5. View the Application
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## 🔮 Future Improvements
* Refactor JWT storage from `localStorage` to `httpOnly cookies` for enhanced security against XSS attacks.
* Offload the Smart Insights algorithm calculations to the database layer using MongoDB Aggregation Pipelines to optimize performance at scale.
* Implement the 'Update/Edit' functionality for existing expense records.

---
*Developed by Sasanka Dilum Chamuditha*