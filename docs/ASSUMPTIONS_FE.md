# ASSUMPTIONS_FE (Sprint-1)

## Open Questions & UI Assumptions

1. **Auth & Roles**
   - Sprint-1’de gerçek role claim henüz backend’den gelmediği için login ekranında role mock seçimi kullanıldı.
   - `auth_token` + `auth_role` cookie/localStorage üzerinden route guard çalışıyor.

2. **Customer Explore**
   - Nearby/Popular filtreleri toggle olarak varsayıldı.
   - Explore listesi kart/list karışımı yerine hızlı MVP için sade listeyle verildi.

3. **Restaurant & Product Detail**
   - Sprint-1’de ayrı product detail route’u yerine menu satırında ürün açıklaması gösteriliyor.
   - Ürün görselleri opsiyonel alan (`imageUrl?`) olarak API kontratına eklendi.

4. **Same-table Multi-order UX**
   - Checkout ekranında `tableId` editable ve `mergeIfOpenTableOrder=true` payload’u ile mevcut masa siparişine ekleme varsayıldı.

5. **Order History & Review Eligibility**
   - Review eligibility boolean alanı backend’den gelir varsayıldı (`reviewEligible`).
   - Review CTA sadece eligibility true olduğunda gösterilir.

6. **Staff QR Flow**
   - Kamera/cihaz entegrasyonu yerine sprint-1 mock text input ile QR çözümleme akışı var.
   - Backend endpoint varsayımı: `POST /staff/scan/resolve`.

7. **Manager/Business Admin yetkileri**
   - Branch oluşturma yalnızca `BusinessAdmin` için açık.
   - Menu/Category/Product CRUD aksiyonları `BranchManager` + `BusinessAdmin` için açık.

8. **Backend Contract Alignment (v2)**
   - Mevcut backend repo şu an sadece `auth` + `health` endpointlerine sahip.
   - Customer/Staff/Manager endpointleri FE contract olarak tanımlandı ve backend v2 modülleri çıktığında birebir doğrulanacak.
