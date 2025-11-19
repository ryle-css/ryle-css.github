📦 Store Inventory Management System

A fully responsive, mobile-friendly inventory management web application featuring dashboard analytics, item CRUD, image upload, sales tracking, and admin authentication.

Built with:

React + TypeScript + Tailwind (frontend)

Node.js + Express + Prisma + PostgreSQL (backend)

JWT Auth

S3-compatible image upload

Docker + GitHub Actions CI

🚀 Features
✅ Inventory Management

Add, edit, delete items

Image upload (PNG/JPG/WEBP) with preview

SKU uniqueness enforcement

Low-stock detection

Search by name, SKU, or category

📊 Dashboard Metrics

Total Items

Low Stock Count

Inventory Value

Total Sales

💰 Sales Tracking

Sell items and auto-deduct quantity

Track sales records

Update dashboard totals in real time

🔐 Authentication

Admin login (JWT-based)

Protected pages & API routes

📱 Responsive Design

Mobile-first UI

Clean modal interface for adding/editing items

🔄 API

REST API for items, auth, uploads, and statistics.

🧪 Tests

Unit + integration tests

E2E tests (Playwright/Cypress)

🛠️ Tech Stack Overview
Layer	Tech
Frontend	React, Vite/Next, TypeScript, Tailwind, shadcn/ui
Backend	Node.js, Express, TypeScript
ORM	Prisma
Database	PostgreSQL
Storage	Amazon S3 or compatible
Testing	Vitest/Jest + Playwright
Deployment	Vercel / Render / Docker
CI/CD	GitHub Actions
📁 Project Structure
/
├─ .github/workflows/ci.yml
├─ docker-compose.yml
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.ts
├─ backend/
│  ├─ src/
│  ├─ prisma/
│  ├─ package.json
│  └─ tsconfig.json
├─ .env.example
└─ README.md

⚙️ Getting Started
1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

🧑‍💻 Backend Setup
2. Install dependencies
cd backend
pnpm install

3. Configure environment variables

Copy the template:

cp .env.example .env


Edit .env:

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory
JWT_SECRET=replace_me_with_random_string
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

4. Start PostgreSQL (Docker)

From the project root:

docker-compose up -d


This boots a local PostgreSQL instance at
postgres://postgres:postgres@localhost:5432/inventory

5. Run database migrations
cd backend
pnpm prisma migrate dev


(Optional) Seed sample items:

pnpm prisma db seed

6. Start backend dev server
pnpm dev


Backend will run at:
👉 http://localhost:4000

🎨 Frontend Setup
7. Install dependencies
cd ../frontend
pnpm install

8. Configure environment variables

Create frontend/.env:

VITE_API_URL=http://localhost:4000

9. Start the dev server
pnpm dev


Frontend will run at:
👉 http://localhost:5173

🔐 Authentication
Register admin (first-time)

Send POST:

POST /api/auth/register
{
  "email": "admin@example.com",
  "password": "yourpassword"
}


Then login:

POST /api/auth/login
→ returns { token }


Include token in all protected requests:

Authorization: Bearer <token>

📡 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login

Items
GET    /api/items
GET    /api/items/:id
POST   /api/items        (multipart/form-data)
PUT    /api/items/:id    (multipart/form-data)
DELETE /api/items/:id

Sales
POST /api/items/:id/sell

Stats
GET /api/stats

📤 Image Upload

Accepts: PNG, JPG, WEBP, max 5MB

Upload flow: frontend → backend → S3 → URL stored in DB

Preview handled via FileReader before upload

🧪 Running Tests
Backend tests:
cd backend
pnpm test

Frontend tests:
cd frontend
pnpm test

End-to-end:
pnpm e2e

🐳 Docker (Full Stack)

Build and run:

docker-compose up --build


This will spin up:

Frontend container

Backend container

PostgreSQL

🚢 Deployment
Frontend (Vercel)

Connect your repo

Add env: VITE_API_URL=https://your-backend-url.com

Backend (Render/Heroku/Docker)

Use Dockerfile or Node builder

Add env vars from .env.example

Add persistent PostgreSQL database

Add S3 credentials

🔄 GitHub Actions CI/CD

Included in:

.github/workflows/ci.yml


Runs on every push & PR:

Install deps

Run lint

Run backend tests

Run frontend tests

Validate build

🧩 Sample Seed Data
{
  "name": "Headset",
  "sku": "DL-33",
  "category": "Technology",
  "supplier": "Ryan",
  "quantity": 35,
  "price": 100,
  "imageUrl": "/uploads/headset.jpg"
}

🤝 Contributing

Fork repo

Create feature branch (feat/new-ui)

Commit changes

Open pull request

📄 License

MIT License — free to use, modify, and distribute.
