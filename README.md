# 🏅 CertifyAI — Automatic Certificate Generator

> AI-Powered Certificate and Resume Management System for Colleges & Companies

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=flat&logo=django)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat&logo=postgresql)

---

## 📌 Project Overview

CertifyAI is a smart automation platform for colleges and companies to securely manage documents and generate certificates automatically. It uses OCR and AI to extract data, generate certificates with one click, analyze resumes with ATS scoring, and verify certificates via QR codes.

---

## 🚀 Core Features

| Feature | Description | Tech Used |
|---------|-------------|-----------|
| 🎓 Certificate Generation | One-click degree/experience/completion/relieving certs | ReportLab + Pillow |
| 📄 OCR Data Extraction | Extract fields from uploaded documents | Tesseract + OpenCV |
| 🤖 ATS Resume Analyzer | Score resumes against job requirements | spaCy + scikit-learn |
| 🖨️ Bulk Print | Department-wise batch certificate printing | Django + PostgreSQL |
| 🔐 QR Verification | Scan & verify certificate authenticity | qrcode library |
| 🗄️ Database Management | Full CRUD with search, filter, paginate | PostgreSQL |
| 📊 Dashboard | Analytics, charts, recent activity | Recharts |
| 🔒 Secure Admin | JWT-based authentication | djangorestframework-simplejwt |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — UI framework
- **Tailwind CSS** + **Bootstrap** — Styling
- **React Router DOM v6** — Routing
- **Axios** — API communication
- **Recharts** — Charts and graphs

### Backend
- **Django 5** + **Django REST Framework** — API server
- **JWT Authentication** — Secure token-based auth
- **PostgreSQL** (Neon Cloud) — Primary database

### AI / Processing
- **Tesseract OCR** + **pytesseract** — Document text extraction
- **OpenCV** — Image preprocessing
- **Pillow (PIL)** — Image editing
- **ReportLab** — PDF generation
- **pdfplumber / PyPDF2** — Resume PDF reading
- **spaCy** — NLP field parsing
- **scikit-learn** — ATS TF-IDF scoring
- **NLTK** — Keyword matching
- **qrcode** — QR code generation

---

## 📁 Project Structure

```
certificate-system/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/          # Layout, Sidebar, Topbar
│   │   ├── pages/               # All 9 pages
│   │   ├── services/            # API calls (api.js)
│   │   └── context/             # AuthContext
│   ├── package.json
│   └── vite.config.js
│
└── backend/                     # Django API
    ├── certifyai/               # Django project (settings, urls)
    ├── users/                   # Custom admin user + JWT auth
    ├── certificate_app/         # Certificate CRUD + PDF generation
    ├── ocr_app/                 # OCR extraction pipeline
    ├── ats_app/                 # ATS resume analysis
    ├── qr_app/                  # QR generation & verification
    ├── manage.py
    └── requirements.txt
```

---

## ⚡ Quick Start

### 1. Clone & Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Copy and configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, SECRET_KEY

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:8000
npm run dev
```

### 3. Install Tesseract OCR

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```
**macOS:**
```bash
brew install tesseract
```
**Windows:**
Download from: https://github.com/UB-Mannheim/tesseract/wiki

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render
1. Connect GitHub repo to Render
2. Set environment variables from `.env`
3. Build command: `pip install -r requirements.txt && python manage.py migrate`
4. Start command: `gunicorn certifyai.wsgi:application`

### Database → Neon PostgreSQL
1. Create account at neon.tech
2. Create database `certifyai_db`
3. Copy connection string to `DATABASE_URL` in `.env`

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Admin login (JWT) |
| POST | `/api/auth/logout/` | Logout |
| GET/PATCH | `/api/auth/profile/` | Admin profile |
| GET/POST | `/api/certificates/` | List / Create certificates |
| POST | `/api/certificates/generate/` | Generate certificate PDF |
| POST | `/api/certificates/bulk-generate/` | Bulk generate ZIP |
| POST | `/api/certificates/{id}/regenerate/` | Regenerate PDF |
| GET | `/api/certificates/verify/{code}/` | Public verify by code |
| POST | `/api/ocr/extract/` | OCR document extraction |
| POST | `/api/ats/analyze/` | ATS resume analysis |
| GET | `/api/qr/generate/{id}/` | Generate QR code image |
| GET | `/api/qr/verify/{code}/` | Verify QR code |
| GET | `/api/dashboard/stats/` | Dashboard statistics |

---

## 👨‍💻 Developer

Built with ❤️ using React + Django + AI/ML stack.

© 2024 CertifyAI. All rights reserved.
