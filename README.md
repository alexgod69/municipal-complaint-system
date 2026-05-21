# Municipal Complaint Management System (MCMS)

A full-stack web application built with MERN Stack + Django for managing municipal complaints.

---

## Tech Stack

| Layer       | Technology                     |
|-------------|-------------------------------|
| Frontend    | React.js + Vite + Tailwind CSS |
| Backend API | Node.js + Express.js           |
| Admin Panel | Django + Django REST Framework |
| Database    | MongoDB (Mongoose)             |
| Auth        | JWT                            |

---

## Project Structure

```
municipal/
├── client/           React frontend
├── server/           Express backend
└── django_panel/     Django admin panel
```

---

## Quick Start

### 1. Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB (local or Atlas)

### 2. Backend (Express)

```bash
cd server
npm install
cp .env.example .env      # Edit MONGO_URI and JWT_SECRET
node seed.js              # Seed demo data
npm run dev               # Runs on :5000
```

### 3. Frontend (React)

```bash
cd client
npm install
npm run dev               # Runs on :5173
```

### 4. Django Admin Panel

```bash
cd django_panel
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000   # Runs on :8000
```

---

## Demo Credentials

| Role       | Email                 | Password   |
|------------|----------------------|------------|
| Admin      | admin@mcms.com       | Admin@123  |
| Department | roads@mcms.com       | Roads@123  |
| Citizen    | rahul@example.com    | Rahul@123  |

---

## API Endpoints

| Method | Endpoint                    | Description           |
|--------|-----------------------------|-----------------------|
| POST   | /api/auth/register          | Register user         |
| POST   | /api/auth/login             | Login                 |
| GET    | /api/auth/me                | Get current user      |
| POST   | /api/complaints             | Submit complaint      |
| GET    | /api/complaints             | Get all (admin/dept)  |
| GET    | /api/complaints/mine        | Get my complaints     |
| GET    | /api/complaints/:id         | Get by ID             |
| PUT    | /api/complaints/:id         | Update status         |
| PUT    | /api/complaints/:id/assign  | Assign to department  |
| POST   | /api/complaints/:id/remarks | Add remark            |
| DELETE | /api/complaints/:id         | Delete complaint      |
| GET    | /api/departments            | List departments      |
| GET    | /api/analytics/stats        | Dashboard stats       |

---

## Roles & Permissions

- **Citizen** — Register, submit/track own complaints
- **Department** — View assigned complaints, update status, add remarks
- **Admin** — Full access: manage all complaints, assign, view analytics, manage users
