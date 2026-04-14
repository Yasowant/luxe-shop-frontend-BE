# 🛒 E-Commerce Microservices Platform

A scalable **Node.js microservices-based e-commerce backend** with an API Gateway, centralized authentication, and multiple independent services.

---

# 🚀 Architecture Overview

```
Client (Frontend)
        ↓
   API Gateway (Auth + Routing)
        ↓
 ┌───────────────┬───────────────┬───────────────┬───────────────┐
 | Auth Service  | Product       | Cart Service  | Order Service |
 |               | Service       |               |               |
 └───────────────┴───────────────┴───────────────┴───────────────┘
```

---

# 🧩 Services

## 🔐 Auth Service

- User registration & login
- JWT authentication
- Role-based access control

## 📦 Product Service

- Manage products (CRUD)

## 🛒 Cart Service

- Add/remove/update cart items

## 📑 Order Service

- Place and track orders

## 🌐 API Gateway

- Central entry point
- Request routing
- Authentication handling

## 📦 Common Package (`@common`)

- Shared authentication middleware
- Reusable logic across services

---

# ⚙️ Tech Stack

- Node.js, Express.js
- MongoDB
- JWT Authentication
- Microservices Architecture

---

# 📁 Project Structure

```
ecommerce-microservices/
│
├── api-gateway/
├── auth-service/
├── product-service/
├── cart-service/
├── order-service/
├── common/
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🔧 Setup Instructions

## 1. Clone Repo

```
git clone https://github.com/your-username/ecommerce-microservices.git
cd ecommerce-microservices
```

---

## 2. Install Dependencies

```
cd common && npm install

cd ../api-gateway && npm install
cd ../auth-service && npm install
cd ../product-service && npm install
cd ../cart-service && npm install
cd ../order-service && npm install
```

---

## 3. Environment Variables

Create `.env` in each service:

```
PORT=4000
JWT_SECRET=your_secret_key

AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4003
CART_SERVICE_URL=http://localhost:4004
```

---

# ▶️ Run Services

Run each service separately:

```
npm run dev
```

---

# 🔐 Authentication

- Login → get JWT
- Send in header:

```
Authorization: Bearer <token>
```

- API Gateway validates and forwards user data

---

# 🚀 Features

- Microservices architecture
- API Gateway pattern
- Centralized authentication
- Shared common package
- Scalable backend design

---

# 👨‍💻 Author

**Yasowant Nayak**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
