# 💰 Smart Family Budget

A full-stack personal finance dashboard built for families, salaried employees, senior citizens, and housewives to manage money together.

---

## ✨ Features

- 🔐 Authentication (localStorage demo mode + JWT backend)
- 📊 Dashboard with live balance, income, expense, savings cards
- 💸 Expense tracking with categories, filters, voice input
- 🎤 Voice input in Tamil & English ("Food 500" / "சாப்பாடு 200")
- 🎯 Savings goals with progress tracking
- 📝 Family notes (grocery lists, reminders, planning)
- 💬 Family chat messaging
- 🤝 Expense splitting among family members
- 📈 Analytics: pie chart + bar chart + monthly trends
- 🤖 AI finance suggestions (50/30/20 rule, spending alerts)
- 📄 PDF monthly report export
- 🌙 Dark/light mode toggle
- 👴 Senior-friendly mode (larger UI)
- 📱 Fully responsive (mobile, tablet, desktop)

---

## 🗂 Folder Structure

```
smart-family-budget/
├── client/                     # React (Vite) frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx             # Root app with routing
│       ├── main.jsx
│       ├── index.css           # Global premium CSS
│       ├── context/
│       │   ├── AuthContext.jsx # Auth state
│       │   └── AppContext.jsx  # All budget data + localStorage
│       ├── hooks/
│       │   └── useVoice.js     # Voice input hook (Tamil/English)
│       ├── utils/
│       │   ├── helpers.js      # formatCurrency, categories, AI suggestions
│       │   └── pdfExport.js    # jsPDF monthly report
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── SummaryCards.jsx
│       │   ├── SalaryEditor.jsx
│       │   ├── ExpenseForm.jsx
│       │   ├── ExpenseList.jsx
│       │   ├── ExpenseCharts.jsx
│       │   ├── SavingsTracker.jsx
│       │   ├── Notes.jsx
│       │   ├── FamilyChat.jsx
│       │   ├── SplitExpense.jsx
│       │   └── AISuggestions.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── Dashboard.jsx
│           ├── ExpensesPage.jsx
│           ├── Reports.jsx
│           ├── NotesPage.jsx
│           ├── SavingsPage.jsx
│           ├── ChatPage.jsx
│           ├── SplitPage.jsx
│           ├── Profile.jsx
│           └── Settings.jsx
│
└── server/                     # Node.js + Express backend
    ├── index.js
    ├── package.json
    ├── .env.example
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── User.js
    │   ├── Expense.js
    │   ├── Salary.js
    │   ├── Savings.js
    │   ├── Note.js
    │   ├── Chat.js
    │   └── Split.js
    └── routes/
        ├── auth.js
        ├── expenses.js
        ├── salary.js
        ├── savings.js
        ├── notes.js
        ├── chat.js
        └── split.js
```

---

## 🚀 Quick Start (Frontend Only — No Backend Needed)

The app works in **demo mode** using localStorage — no server required.

```bash
# 1. Enter client folder
cd smart-family-budget/client

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5173
```

---

## 🖥 Full Stack Setup (With MongoDB Backend)

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

### Backend Setup
```bash
cd smart-family-budget/server

# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGO_URI=mongodb://localhost:27017/smart_family_budget
# JWT_SECRET=your_secret_key

# Start server
npm run dev       # development (nodemon)
npm start         # production
```

### Frontend Setup
```bash
cd smart-family-budget/client

npm install
npm run dev
```

### Build for Production
```bash
cd client
npm run build
# Output: client/dist/
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Charts | Chart.js, react-chartjs-2 |
| PDF Export | jsPDF, jsPDF-autotable |
| Voice Input | Web Speech API (Chrome) |
| Styling | Custom CSS (no framework) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| Storage | localStorage (demo) |

---

## 🎤 Voice Input

- Uses native **Web Speech API** (Chrome recommended)
- Supports **Tamil (ta-IN)** and **English (en-IN)**
- Say: `"Food 500"` → auto-fills ₹500 in Food category
- Say: `"சாப்பாடு 200"` → auto-fills ₹200 in Food category
- Switch language from the dropdown next to the mic button

---

## 📄 PDF Export

- Go to **Reports** page → select month → click **Export PDF**
- Includes: income, expenses, category breakdown, all transactions, savings goals

---

## 👴 Senior Mode

- Go to **Settings** → enable **Senior-Friendly Mode**
- Enlarges all buttons, text, and inputs for accessibility

---

## 📱 Responsive Design

- **Mobile**: Sidebar slides in from hamburger menu
- **Tablet**: Stacked layout
- **Desktop**: Full sidebar + content split

---

## 🔒 Authentication

**Demo mode (no server):**
- Sign up creates an account in `localStorage`
- Data is isolated per User ID

**With backend:**
- JWT tokens (30-day expiry)
- Passwords hashed with bcryptjs

---

## 📦 npm Commands Summary

```bash
# Frontend
cd client
npm install                    # Install all dependencies
npm run dev                    # Start dev server (port 5173)
npm run build                  # Build for production
npm run preview                # Preview production build

# Backend
cd server
npm install                    # Install all dependencies
npm run dev                    # Start with nodemon (port 5000)
npm start                      # Start production
```
