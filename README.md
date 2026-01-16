# 🎯 Smart Feedback Collection and Analysis System

A full-stack web application for collecting user feedback and performing real-time sentiment analysis using Natural Language Processing (NLP). Built with Flask (Python) backend and React frontend, featuring JWT authentication, admin dashboard, and beautiful data visualizations.


---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Admin Access](#admin-access)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### User Features
- 🔐 **Secure Authentication**: JWT-based login and registration
- 📝 **Feedback Submission**: Submit feedback with category tagging
- 🤖 **AI-Powered Sentiment Analysis**: Automatic classification (Positive/Neutral/Negative) using TextBlob NLP
- 📊 **Personal Dashboard**: View sentiment statistics with interactive charts
- 🎨 **Modern UI**: Responsive design with gradient backgrounds and smooth animations
- 🔒 **Password Management**: Change password and forgot password functionality

### Admin Features
- 👨‍💼 **Admin Dashboard**: Comprehensive overview of all feedback and users
- 📈 **Analytics**: View sentiment distribution across all users
- 🗑️ **Feedback Management**: Delete inappropriate or spam feedback
- 👥 **User Management**: View all registered users and their admin status
- 🔍 **Detailed Insights**: Access full feedback history with timestamps

### Technical Features
- 🚀 **RESTful API**: Clean and documented API endpoints
- 🔒 **Secure**: Password hashing with bcrypt, JWT token authentication
- 🌐 **CORS Enabled**: Secure cross-origin resource sharing
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ☁️ **Cloud Deployed**: Production-ready deployment on Render and Vercel
- 🗄️ **Cloud Database**: Railway MySQL for reliable data storage

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Database ORM**: SQLAlchemy
- **Authentication**: Flask-JWT-Extended
- **Password Hashing**: Flask-Bcrypt
- **NLP**: TextBlob (Sentiment Analysis)
- **CORS**: Flask-CORS
- **Database Driver**: PyMySQL

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Custom CSS with modern gradients
- **HTTP Client**: Fetch API
- **Build Tool**: Vite

### Database
- **Primary**: MySQL (Railway Cloud)
- **Tables**: Users, Feedback

### Deployment
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)
- **Database**: Railway MySQL (Free tier)

---

## 🌐 Demo

**Live Application**: [https://feedback-sentiment-analysis-2rlr.vercel.app](https://feedback-sentiment-analysis-2rlr.vercel.app)

**Backend API**: [https://feedback-sentiment-analysis-furg.onrender.com](https://feedback-sentiment-analysis-furg.onrender.com)

### Test Accounts

**Admin Account**:
- Email: `vamshiboini983@gmail.com`
- Password: `Vamshi@985`

**Regular User** (create your own via registration)

---

## 🚀 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- MySQL 8.0+
- Git

### Clone Repository

```bash
git clone https://github.com/vamshi-boini/feedback-sentiment-analysis.git
cd feedback-sentiment-analysis


# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy and configure with your credentials
cp .env.example .env

# Run backend server
python app.py

# Navigate to frontend folder
cd feedback-frontend

# Install dependencies
npm install

# Run development server
npm run dev
