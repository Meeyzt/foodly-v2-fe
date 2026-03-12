# IA & Route Haritası — Foodly v2 FE

## Route Prensipleri
- Public ve protected route’lar net ayrılır.
- URL yapısı modül odaklıdır (`/orders`, `/menu`, `/campaigns`).
- Nested route’lar detay ve aksiyon ekranlarını taşır.

## Bilgi Mimarisi (Üst Seviye)
1. Auth
2. Dashboard
3. Sipariş Yönetimi
4. Menü Yönetimi
5. Kampanya Yönetimi
6. Ayarlar

## Route Map (MVP + Yakın Yol Haritası)

### Public
- `/` → Landing / yönlendirme
- `/login` → Giriş
- `/forgot-password` → Şifre sıfırlama (placeholder)

### Protected
- `/dashboard` → Özet metrikler + hızlı aksiyonlar

#### Orders
- `/orders` → Sipariş listesi
- `/orders/[orderId]` → Sipariş detayı

#### Menu
- `/menu` → Ürün listesi
- `/menu/new` → Yeni ürün
- `/menu/[itemId]/edit` → Ürün düzenleme

#### Campaigns
- `/campaigns` → Kampanya listesi
- `/campaigns/new` → Yeni kampanya
- `/campaigns/[campaignId]/edit` → Kampanya düzenleme

#### Settings
- `/settings/profile` → Profil
- `/settings/users` → Kullanıcı/rol yönetimi (MVP-lite)

## Navigation Önerisi
- Sol menü: Dashboard, Orders, Menu, Campaigns, Settings
- Üst bar: Şube seçici (gelecek), kullanıcı menüsü, çıkış
- Breadcrumb: detay ekranlarında aktif

## Erişim Kuralları (ilk sürüm)
- Auth olmayan kullanıcı protected route’a giremez.
- Login olan kullanıcı `/login`’e giderse `/dashboard`’a yönlendirilir (opsiyonel enhancement).

## Notlar
- Sprint-0’da tüm ekranların tam işlevi zorunlu değildir; route ve shell varlığı önceliklidir.
- URL naming ile backend resource adlarının tutarlı olması hedeflenir.
