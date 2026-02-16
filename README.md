# 🔖 Smart Bookmark App

A simple real-time bookmark manager built using **Next.js, Supabase, and Tailwind CSS**.

This app allows users to log in using Google, save bookmarks privately, and see updates instantly across multiple tabs.

---

## 🚀 Live Demo

👉 https://smart-bookmark-lemon.vercel.app

## ✨ Features

✅ Google OAuth login (no email/password)
✅ Add bookmarks (title + URL)
✅ Private bookmarks per user
✅ Delete bookmarks
✅ Real-time updates across tabs
✅ Secure database with Row Level Security (RLS)
✅ Responsive modern UI with Tailwind CSS
✅ Deployed on Vercel

---

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS

### Backend / Database

- Supabase Authentication (Google OAuth)
- Supabase PostgreSQL Database
- Supabase Realtime

### Deployment

- Vercel

---

## 🔐 Authentication

Users sign in using **Google OAuth** via Supabase.

Only authenticated users can:

- add bookmarks
- view their bookmarks
- delete bookmarks

---

## 🔒 Security (Row Level Security)

Supabase RLS policies ensure:

✔ Users can only view their own bookmarks
✔ Users can only insert their own data
✔ Users can delete only their bookmarks

This guarantees complete data privacy.

---

## ⚡ Real-Time Updates

The app listens to database changes using Supabase Realtime.

If a bookmark is added in one tab:

👉 it appears instantly in other tabs
👉 no refresh required

---

## 📂 Database Schema

Table: `bookmarks`

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| title      | text      |
| url        | text      |
| created_at | timestamp |

---

## 🧪 How to Test Realtime

1. Open the app in **two browser tabs**
2. Add a bookmark in Tab 1
3. Watch Tab 2

✅ Bookmark appears automatically

---

## 🛠 Problems Faced & Solutions

### ❌ Google login redirect error

**Fix:** Added Supabase callback URL in Google Cloud Console and Supabase URL settings.

---

### ❌ Bookmarks not private

**Fix:** Enabled Row Level Security and created policies using:

```
auth.uid() = user_id
```

---

### ❌ Realtime updates not working

**Fix:** Enabled Supabase Realtime and added channel listener in React.

---

### ❌ Tailwind CSS setup errors

**Fix:** Installed Tailwind correctly and configured globals.css and tailwind.config.js.

---

### ❌ Turbopack / Next.js errors

**Fix:** Cleared `.next` folder and restarted server.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone repository

```
git clone https://github.com/Jagadevi147/smart-bookmark.git
cd smart-bookmark
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Create environment file

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4️⃣ Run project

```
npm run dev
```

---

## 🌍 Deployment

Deployed using **Vercel**.

Environment variables were added in Vercel dashboard.

---

## 🎯 Future Improvements

- Edit bookmarks
- Bookmark categories
- Search functionality
- Dark mode
- Mobile app version

---

## 👩‍💻 Author

**Jagadevi**
MCA Student – Cambridge Institute of Technology
Bangalore

---

## ⭐ Project Status

✅ Completed
✅ Meets all assignment requirements
✅ Ready for evaluation
