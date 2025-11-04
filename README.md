# 💇‍♀️ Tina - Güzellik Salonu Randevu Sistemi

**Tina** güzellik salonu için geliştirilmiş modern bir online randevu sistemidir. Müşteriler bu sistem üzerinden hizmet ve personel seçerek, uygun tarih ve saatte randevu alabilirler.

## 🌟 Özellikler

- **Hizmet Seçimi**: Saç kesimi, boyama, manikür, pedikür, cilt bakımı ve daha fazlası
- **Personel Seçimi**: Uzman personellerimiz arasından seçim yapabilme
- **Tarih ve Saat Seçimi**: Müsait zaman dilimlerini görüntüleme ve seçim
- **Randevu Yönetimi**: Mevcut randevuları görüntüleme, değiştirme ve iptal etme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **MHRS Benzeri Kullanıcı Deneyimi**: Sezgisel ve kullanıcı dostu arayüz

## 🚀 Teknolojiler

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **UUID**: Benzersiz ID üretimi

### Frontend
- **React**: UI kütüphanesi
- **Vite**: Build tool ve dev server
- **CSS**: Özel stil tasarımı

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/Zeron3535/t-na-randevu.git
cd t-na-randevu
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

## 🎯 Kullanım

Sistemi çalıştırmak için iki terminal penceresi açmanız gerekir:

### Terminal 1: Backend Server
```bash
npm run server
```
Server http://localhost:3001 adresinde çalışacaktır.

### Terminal 2: Frontend Development Server
```bash
npm run dev
```
Uygulama http://localhost:3000 adresinde açılacaktır.

## 📱 Kullanıcı Rehberi

### Randevu Alma
1. Ana sayfada "Yeni Randevu Al" sekmesine tıklayın
2. Ad-soyad ve telefon numaranızı girin
3. Almak istediğiniz hizmeti seçin
4. Tercih ettiğiniz personeli seçin
5. Uygun bir tarih seçin
6. Müsait saat dilimlerinden birini seçin
7. Randevu özetini kontrol edin ve onaylayın

### Randevuları Görüntüleme
1. "Randevularım" sekmesine tıklayın
2. Telefon numaranızı girin
3. "Randevularımı Göster" butonuna tıklayın
4. Tüm randevularınızı görüntüleyebilir ve iptal edebilirsiniz

## 🎨 Hizmetlerimiz

- **Saç Kesimi** - 30 dakika - 150 ₺
- **Saç Boyama** - 120 dakika - 500 ₺
- **Manikür** - 45 dakika - 100 ₺
- **Pedikür** - 60 dakika - 150 ₺
- **Cilt Bakımı** - 90 dakika - 400 ₺
- **Makyaj** - 60 dakika - 300 ₺
- **Kaş Tasarımı** - 30 dakika - 80 ₺
- **Kirpik Lifting** - 45 dakika - 200 ₺

## 👥 Ekibimiz

- **Ayşe Yılmaz** - Saç Uzmanı
- **Fatma Demir** - Cilt Bakım Uzmanı
- **Zeynep Kaya** - Manikür & Pedikür Uzmanı
- **Elif Şahin** - Makyaj Uzmanı

## 🏗️ Proje Yapısı

```
t-na-randevu/
├── src/
│   ├── components/
│   │   ├── BookingForm.jsx
│   │   └── MyAppointments.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js
├── vite.config.js
├── index.html
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Services
- `GET /api/services` - Tüm hizmetleri listele

### Staff
- `GET /api/staff` - Tüm personeli listele

### Appointments
- `GET /api/available-slots` - Müsait zaman dilimlerini getir
- `POST /api/appointments` - Yeni randevu oluştur
- `GET /api/appointments/:phone` - Telefon numarasına göre randevuları getir
- `PUT /api/appointments/:id` - Randevu güncelle
- `DELETE /api/appointments/:id` - Randevu iptal et

## 📝 Veri Modeli

### Appointment
```javascript
{
  id: String,
  customerName: String,
  customerPhone: String,
  serviceId: String,
  serviceName: String,
  staffId: String,
  staffName: String,
  date: String,
  time: String,
  duration: Number,
  price: Number,
  status: String,
  createdAt: String
}
```

## 🔐 Güvenlik

- CORS yapılandırması
- Input validasyonu
- Telefon numarası formatı kontrolü
- Çakışma kontrolü (aynı personel aynı saatte iki randevu alamaz)

## 🚀 Production Build

```bash
npm run build
```

Build edilmiş dosyalar `dist/` klasöründe oluşturulacaktır.

## 📄 Lisans

ISC

## 👤 İletişim

Sorularınız için lütfen iletişime geçin.