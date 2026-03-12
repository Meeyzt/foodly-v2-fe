# PRD DRAFT — Foodly v2 Frontend (Sprint-0)

## 1) Ürün Özeti
Foodly v2 FE, restoran operasyonunu yöneten ekipler için sipariş, menü ve kampanya yönetimini tek panelde toplayan web uygulamasıdır. Sprint-0 hedefi, ürünün MVP kapsamını netleştirmek ve teknik temelini sağlamaktır.

## 2) Hedef Kullanıcı

### Birincil Persona: Restoran Operasyon Yöneticisi
- Çok şubeli veya tek şubeli işletme yönetir.
- Gün içinde sipariş akışı, ürün stokları ve kampanyaları takip eder.
- Hızlı aksiyon ve hatasız işlem bekler.

### İkincil Persona: Kasiyer / Şube Yetkilisi
- Günlük operasyonel işleri yürütür.
- Temel raporlara ve hızlı sipariş güncellemesine ihtiyaç duyar.

### Üçüncül Persona: Sistem Yöneticisi
- Kullanıcı yetkilendirme ve sistem ayarlarını yönetir.

## 3) Problem Tanımı
- Mevcut panelde akışlar tutarsız, performans düşük ve hata yönetimi zayıf.
- Kritik işlemlerde (login, sipariş güncelleme, menü yayına alma) kullanıcı güveni düşük.
- Modüler olmayan FE yapısı, geliştirme hızını azaltıyor.

## 4) Ürün Hedefleri (MVP odaklı)
1. Güvenli ve stabil kimlik doğrulama + route koruması.
2. Sipariş/menü/kampanya için ölçeklenebilir IA ve route iskeleti.
3. Tutarlı API client + error handling standardı.
4. Sprint bazlı teslimata uygun task kırılımı ve DoD/Test kriterleri.

## 5) Ana Kullanıcı Akışları

### Akış A — Giriş ve Dashboard’a Erişim
1. Kullanıcı `/login` ekranına gelir.
2. E-posta/şifre ile giriş yapar.
3. Başarılı ise token/session set edilir.
4. Kullanıcı `/dashboard` ekranına yönlendirilir.
5. Yetkisiz erişimde middleware ile login’e geri yönlendirilir.

### Akış B — Siparişleri İzleme (MVP placeholder)
1. Kullanıcı dashboard’dan "Siparişler" modülüne gider.
2. Liste ekranında aktif siparişleri görür.
3. Detay ekranından durum günceller (hazırlanıyor/yolda/tamamlandı).

### Akış C — Menü Yönetimi (MVP placeholder)
1. Kullanıcı "Menü" modülüne gider.
2. Ürün ekler/düzenler.
3. Değişikliği yayına alır.

## 6) MVP Kapsam

### Dahil
- Login + oturum yönetimi + protected route.
- Dashboard temel shell.
- Sipariş/menü/kampanya modülleri için route & ekran iskeleti.
- API istemcisi, global hata normalizasyonu, temel UI error/empty/loading pattern’i.
- Lint/test/build pipeline.

### Hariç (Post-MVP)
- Gelişmiş analitik ve raporlama.
- Çoklu dil/i18n.
- Offline-first/PWA.
- Gelişmiş rol matrisi (RBAC v2).

## 7) MVP Başarı Kriterleri
- Login başarı oranı (teknik hata hariç) > %99.
- Protected route bypass olmaması.
- Kritik sayfalarda beyaz ekran/hard crash olmaması.
- CI’da lint+typecheck+test+build başarıyla geçmesi.

## 8) Riskler
- API kontratlarının netleşmemesi.
- Auth/token lifecycle kararsızlığı.
- Sprint-0 içinde gereğinden büyük kapsam açılması.

## 9) Sprint-0 Çıktı Tanımı
- Bu döküman + IA/Route + FE mimari kararları + task backlog.
- Çalışan minimal FE scaffold (dev/lint/test/build).
