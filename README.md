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
- SQLite (dosya: `beautybook.db`, `sql.js` — **node-gyp / Visual Studio derlemesi gerekmez**, `npm install` Windows’ta takılmaz)

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

**Not (Windows):** Bu projede veri katmanı **`sql.js`** kullanılır (yerel C++ derlemesi gerekmez).

### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` hatası

Antivirüs veya okul ağı SSL taraması yapıyorsa `npm install` bu hatayı verir. Projede `backend/.npmrc` içinde yalnızca bu klasör için `strict-ssl=false` tanımlıdır.

**Kolay kurulum (Windows):** `backend` klasöründe çift tıkla veya CMD’de:

```bat
install-deps.bat
```

Manuel deneme:

```bat
cd backend
set NODE_OPTIONS=--use-system-ca
npm install
```

Hâlâ olmazsa: antivirüs “HTTPS/SSL tarama”yı kapat, hotspot dene veya [Node 22 LTS](https://nodejs.org) kur.

### `403 Forbidden` (registry.npmjs.org)

Okul/kurum ağı veya güvenlik yazılımı npm’i engelliyor olabilir. **Ayna ile kur:**

```bat
cd backend
npm install --registry https://registry.npmmirror.com
```

veya `install-deps.bat` (sırayla resmi + ayna dener).

Kontrol: `npm config get registry` → `https://registry.npmjs.org/` olmalı. Farklı bir adres yazıyorsa: `npm config delete registry`

---

## Gerekli Paketler

```bash
npm install express sql.js bcryptjs jsonwebtoken dotenv cors swagger-ui-express swagger-jsdoc
npm install --save-dev nodemon jest
```

---

## .env Dosyası

**Gizli bilgiler repoda tutulmaz.** Şablon: `backend/.env.example`. İlk kurulumda kopyalayın:

```bash
cd backend
copy .env.example .env
```

Sonra `backend/.env` içinde özellikle `JWT_SECRET` alanını güçlü, rastgele bir değerle doldurun (örnek: `openssl rand -hex 32` veya Node ile rastgele üretin). `backend/.env` `.gitignore` ile commit edilmez; **asla** GitHub’a göndermeyin.

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

Arama parametresi ile filtreleme:

```http
GET /api/appointments?search=sac
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

| Alan | Tip |
| -------- | ------- |
| id | INTEGER |
| name | TEXT |
| email | TEXT |
| password | TEXT |

---

## Appointment

| Alan | Tip |
| --------------- | ------- |
| id | INTEGER |
| userId | INTEGER |
| serviceName | TEXT |
| employeeName | TEXT |
| appointmentDate | TEXT |
| status | TEXT |
| note | TEXT |

---

# Swagger

Swagger endpoint:

```text
http://localhost:5000/api-docs
```

Swagger JSON:

```text
http://localhost:5000/api-docs.json
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
