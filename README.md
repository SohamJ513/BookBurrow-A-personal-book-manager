# 📚 BookBurrow

> Your cozy reading nook. Track books, set goals, and rediscover your favorite authors.

![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4ea94b)
![License](https://img.shields.io/badge/License-ISC-green)

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication with httpOnly cookies
- Protected routes with authentication middleware
- Logout confirmation modal

### 📚 Book Management
- Create, Read, Update, Delete books
- Add book details: title, author, tags, and status
- Track reading progress with page numbers
- Filter books by status and tags

### 📊 Dashboard
- Overview statistics (Total, Reading, Completed, Want to Read)
- Quick stats widgets for completed and currently reading books
- Reading goal with progress tracking
- Set and update yearly reading goals

### 📖 Reading Progress
- Track progress percentage for each book
- Progress bar visualization
- Track total pages and current page

### 📥 Export
- Export books as CSV (Excel compatible)
- Export books as JSON (Backup format)

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persists user preference
- Follows system preference by default

### ✨ UI/UX
- Smooth animations and transitions
- Responsive design for all devices
- Glassmorphism effects
- Professional gradient buttons and cards

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.12 | React framework with App Router |
| Tailwind CSS | 4.0 | Utility-first CSS framework |
| Axios | Latest | HTTP client for API calls |
| React Hot Toast | Latest | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v22+ | JavaScript runtime |
| Express | 5.x | Web framework |
| MongoDB Atlas | Latest | Cloud database |
| Mongoose | Latest | ODM for MongoDB |
| JWT | Latest | Authentication tokens |
| bcrypt | Latest | Password hashing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **MongoDB Atlas** account (free tier)
- **Git** for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookburrow.git
cd bookburrow

2. BACKEND SETUP
cd backend
npm install

# Create environment file
cp .env.example .env

# Update .env with your values
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A secure random string

npm run dev

3. FRONTEND SETUP
cd ../frontend
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev

. Open the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000

📊 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
POST	/api/auth/logout	Logout user
GET	/api/auth/me	Get current user
Books
Method	Endpoint	Description
GET	/api/books	Get all books
GET	/api/books/stats	Get dashboard stats
GET	/api/books/export/csv	Export as CSV
GET	/api/books/export/json	Export as JSON
POST	/api/books	Add a book
PUT	/api/books/:id	Update a book
DELETE	/api/books/:id	Delete a book


🔧 Environment Variables
Backend (.env)
env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development


Frontend (.env.local)
env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
🚀 Deployment

Backend (Render)
Push code to GitHub

Go to Render.com

Create new Web Service

Connect GitHub repository

Build command: npm install

Start command: npm start

Add environment variables

Frontend (Vercel)
Push code to GitHub

Go to Vercel.com

Import GitHub repository

Set root directory: frontend

Add environment variable:

NEXT_PUBLIC_API_URL = Your Render backend URL

🤝 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Open a Pull Request

📝 License
This project is licensed under the ISC License.

👨‍💻 Author
Name: Soham Jathar

GitHub: https://github.com/SohamJ513

LinkedIn: www.linkedin.com/in/sohamjathar

🙏 Acknowledgments
Built as part of a full-stack developer assignment

Inspired by the love for reading and tracking personal libraries

⭐ Support
If you found this project helpful, please give it a ⭐ on GitHub!

Made with ❤️ and 📚




