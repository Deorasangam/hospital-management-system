# MediFlow Pro - AI-Powered Hospital Management System

A complete, full-stack hospital management system with AI-powered features for efficient healthcare management.

## 🚀 Features

### AI-Enhanced Dashboard
- **AI Medical Assistant Chat**: Interactive chatbot for symptom checking, appointment scheduling queries, and general hospital navigation
- **AI Risk Assessment**: Real-time patient risk scoring based on vital signs with dynamic updates
- **Smart Scheduling**: AI-suggested appointment slots with availability confidence scores
- **AI Analytics Dashboard**: Real-time metrics, wait time prediction, and patient flow analysis
- **Recent Activity Feed**: Hospital events with time tracking

### Core Features
- **Patient Management**: Complete patient registration and records
- **Doctor/Specialist Management**: Doctor profiles with specialties
- **Appointment Scheduling**: Book and manage appointments
- **Billing System**: Invoice generation and payment tracking
- **User Authentication**: Secure JWT-based login/register
- **Dark/Light Theme Toggle**: Responsive theme switching

## 🛠️ Tech Stack

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 + CSS3
- Font Awesome for icons

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Deorasangam/hospital-management-system.git

# Install dependencies
npm install

# Create .env file in backend directory with:
# PORT=5000
# MONGO_URI=your-mongodb-connection-string
# JWT_SECRET=your-jwt-secret

# Start the development server
npm run dev

# Start production server
npm start
```

## 📱 Usage

1. Start the backend server on `http://localhost:5000`
2. Open `frontend/index.html` in your browser
3. Register or login to access the dashboard

## 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── middleware/       # JWT auth middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js    # Express server
├── frontend/         # HTML/CSS/JS frontend
│   ├── index.html  # Main app
│   ├── home.html
│   └── about.html
├── package.json
└── README.md
```
