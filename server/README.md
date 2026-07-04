# V3RII Backend Server

V3RII web sitesi için Node.js/Express tabanlı backend servisi.

## Özellikler

- ✅ İletişim formu e-posta gönderimi
- ✅ Gmail SMTP entegrasyonu
- ✅ CORS desteği
- ✅ Veri doğrulama
- ✅ Hata yönetimi
- ✅ Güvenli e-posta şablonu

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd server
npm install
```

### 2. Environment Variables Ayarlayın

1. `.env.example` dosyasını `.env` olarak kopyalayın:
   ```bash
   cp .env.example .env
   ```

2. `.env` dosyasını düzenleyin:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3001
   ```

### 3. Gmail App Password Alın

1. [Google Account Settings](https://myaccount.google.com/) > Security
2. **2-Step Verification**'ı aktif edin
3. **App passwords** bölümünden yeni bir app password oluşturun
4. Bu password'ü `.env` dosyasında `EMAIL_PASS` olarak kullanın

## Çalıştırma

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server `http://localhost:3001` adresinde çalışacaktır.

## API Endpoints

### POST /api/contact
İletişim formu verilerini e-posta olarak gönderir.

**Request Body:**
```json
{
  "name": "Ad Soyad",
  "email": "email@example.com",
  "product": "CRM Sistemi",
  "message": "Proje detayları..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mesajınız başarıyla gönderildi!"
}
```

### GET /api/health
Server durumunu kontrol eder.

**Response:**
```json
{
  "success": true,
  "message": "Server çalışıyor!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Frontend Entegrasyonu

Frontend uygulamanız şu endpoint'e POST request göndermelidir:
```
http://localhost:3001/api/contact
```

## Güvenlik

- ✅ E-posta doğrulama
- ✅ Veri sanitizasyonu
- ✅ CORS koruması
- ✅ Environment variables ile hassas bilgi koruması

## Troubleshooting

### Gmail Authentication Error
- 2-Step Verification aktif olduğundan emin olun
- App password doğru olduğundan emin olun
- "Less secure app access" kapalı olmalı (App password kullanırken)

### CORS Error
- Frontend ve backend farklı portlarda çalışıyor olmalı
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Port Already in Use
```bash
# Port 3001'i kullanan process'i bulun
netstat -ano | findstr :3001

# Process'i sonlandırın
taskkill /PID <PID> /F
```