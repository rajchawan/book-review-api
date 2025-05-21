# 📚 Book Review API

A secure and scalable RESTful API for managing books and user-generated reviews. Built using **Node.js**, **Express**, **MongoDB**, and **JWT authentication** via HTTP-only cookies.

---

## 🚀 Features

- User **signup**, **login**, and **logout**
- Authenticated users can:
  - **Add books**
  - **Browse, filter, and search books**
  - **Post, update, and delete reviews**
- JWT stored in secure HTTP-only cookies
- Input validations and role-based restrictions (e.g., only review once)

---

## 🛠 Project Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/book-review-api.git
   cd book-review-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`.

---

## ▶️ Running Locally

Ensure MongoDB is accessible (either locally or via Atlas) and `.env` variables are configured.

```bash
npm start
```

Test endpoints via **Postman**, **curl**, or any REST client.

---

## 🧪 Example API Requests

> Replace `http://localhost:5000` with your host and include cookies for authenticated routes.

### 🔐 Signup

```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "secret123"}'
```

### 🔐 Login

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret123"}' \
  -c cookies.txt
```

### 📘 Add Book (Auth required)

```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title": "The Alchemist", "author": "Paulo Coelho", "genre": "Fiction"}'
```

### 🔎 Search Books

```bash
curl "http://localhost:5000/api/search?q=alchemist" -b cookies.txt
```

### 📝 Add Review

```bash
curl -X POST http://localhost:5000/api/books/<book_id>/reviews \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"rating": 5, "comment": "Fantastic read!"}'
```

---

## 🧠 Design Decisions & Assumptions

- **JWT + HTTP-only Cookies** are used for secure session handling (protects from XSS).
- **One review per user per book** is enforced to avoid spamming.
- **MongoDB Atlas** is used for cloud deployment; can be swapped with local MongoDB.
- Passwords are hashed using **bcryptjs** before storing.
- RESTful routing and controller separation ensures maintainable codebase.
- For simplicity, no roles (admin/user) are included, but extendable.
- No frontend — API-first architecture (frontend can be added separately).

---

## 📁 Folder Structure

```
.
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Book.js
│   ├── Review.js
│   └── User.js
├── node_modules/
├── package_json
├── package-lock.json
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── reviewRoutes.js
├── app.js
├── .env
└── README.md
```

---

## 📩 Contact

For any questions, feel free to reach out at [rajchawann@example.com] or via GitHub Issues.

---
