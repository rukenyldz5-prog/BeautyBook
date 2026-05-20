
# BeautyBook

Kuaför ve Güzellik Salonu Randevu Yönetim Sistemi

---

## Proje Hakkında

BeautyBook, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş web tabanlı bir CRUD uygulamasıdır.

Bu sistem sayesinde kullanıcılar:

- kayıt olabilir
- giriş yapabilir
- kendi randevularını oluşturabilir
- randevularını görüntüleyebilir
- güncelleyebilir
- silebilir

Her kullanıcı yalnızca kendi verilerine erişebilir.

---

# Kullanılan Teknolojiler

## Frontend
- HTML
- CSS
- Vanilla JavaScript

## Backend
- Node.js
- Express.js

## Veritabanı
- SQLite3

## Authentication
- JWT
- bcryptjs

## Diğer
- dotenv
- cors
- Swagger UI
- Jest
- GitHub

---

# Proje Özellikleri

- JWT authentication
- Register/Login sistemi
- CRUD işlemleri
- RESTful API
- Kullanıcıya özel veri sistemi
- Swagger API dokümantasyonu
- Unit test yapısı
- Vanilla JS SPA yapısı

---

# Proje Yapısı

```text
beautybook/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── database/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── README.md
````

---

# Kurulum

## Repository Klonlama

```bash
git clone <repo-url>
cd beautybook
```

---

## Backend Kurulumu

```bash
cd backend
npm install
```

---

## Gerekli Paketler

```bash
npm install express sqlite3 bcryptjs jsonwebtoken dotenv cors swagger-ui-express swagger-jsdoc
npm install --save-dev nodemon jest
```

---

## .env Dosyası

```env
PORT=5000
JWT_SECRET=beautybook_secret_key
```

---

# Uygulamayı Çalıştırma

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

---

# Frontend Çalıştırma

frontend klasörünü Live Server ile çalıştırın.

---

# API Endpoints

## Auth

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Appointments

### Randevu Oluştur

```http
POST /api/appointments
```

### Randevuları Listele

```http
GET /api/appointments
```

### Randevu Güncelle

```http
PUT /api/appointments/:id
```

### Randevu Sil

```http
DELETE /api/appointments/:id
```

---

# JWT Kullanımı

Protected route işlemlerinde token kullanılır.

```http
Authorization: Bearer <TOKEN>
```

---

# Veri Tabanı Tabloları

## User

| Alan     | Tip     |
| -------- | ------- |
| id       | INTEGER |
| name     | TEXT    |
| email    | TEXT    |
| password | TEXT    |

---

## Appointment

| Alan            | Tip     |
| --------------- | ------- |
| id              | INTEGER |
| userId          | INTEGER |
| serviceName     | TEXT    |
| employeeName    | TEXT    |
| appointmentDate | TEXT    |
| status          | TEXT    |
| note            | TEXT    |

---

# Swagger

Swagger endpoint:

```text
http://localhost:5000/api-docs
```

---

# Test

```bash
npm test
```

---

# GitHub

```bash
git add .
git commit -m "initial commit"
git push
```

---

# Ders Gereksinimlerine Uygunluk

Bu proje:

* REST API
* CRUD işlemleri
* Vanilla JS SPA
* JWT Authentication
* Swagger/OpenAPI
* Unit Test
* Git/GitHub
* Kullanıcıya özel veri yönetimi

gereksinimlerini karşılamaktadır.

```
