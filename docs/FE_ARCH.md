# FE Architecture — Foodly v2 FE (Sprint-0)

## 1) Mimari Yaklaşım
- Framework: **Next.js App Router + TypeScript**
- Yapı: **Feature-first + shared core**
- Hedef: Modüler, test edilebilir, API’ye dayanıklı frontend omurgası

Önerilen katmanlar:
- `app/`: route, layout, sayfa orkestrasyonu
- `features/`: domain bazlı UI + business logic
- `shared/`: api client, config, ortak util/component/type

## 2) State Yönetimi
- Global client state: **Zustand**
- Kullanım alanı:
  - auth session (token, user, login/logout aksiyonları)
  - UI düzeyi geçici state (gerekirse)
- Server state (MVP): API çağrıları sayfa/feature seviyesinde; Sprint-1’de React Query değerlendirilir.

Prensipler:
- Store’lar domain’e yakın olmalı (`features/auth/model`).
- Store içinde sadece iş kuralları; network side-effect mümkünse api layer’da kalsın.

## 3) API Client Standardı
- Merkez: `shared/api/http-client.ts` (Axios instance)
- Standartlar:
  - `baseURL` env’den gelir (`NEXT_PUBLIC_API_BASE_URL`)
  - timeout ve common headers merkezi tanımlanır
  - request interceptor ile token eklenir

Önerilen gelişim:
- response interceptor ile hata normalize etme
- retry/circuit breaker ihtiyacı için ileri seviye policy (post-MVP)

## 4) Auth Guard
- Route koruma: `src/middleware.ts`
- Kural:
  - `/dashboard` ve protected route’larda token yoksa `/login` redirect
- Token kaynakları:
  - middleware için cookie
  - client-side istekler için localStorage/cookie uyumu

Not:
- Sprint-0’da basit guard yeterli.
- Sprint-1’de refresh token ve token expiry stratejisi netleştirilmeli.

## 5) Error Handling

### Hata Modeli
- Beklenen hata tipleri:
  - Validation (400/422)
  - Auth (401/403)
  - Not Found (404)
  - Server/Network (5xx/timeout)

### UI Davranışı
- Form seviyesinde anlamlı kullanıcı mesajı göster.
- Sayfa seviyesinde fallback component kullan.
- Beklenmeyen hatalar için log/monitoring hook’u aç (Sentry vb. sprint sonrası).

### Kod Prensipleri
- API katmanında ham hata yerine normalize edilmiş hata nesnesi dön.
- Feature katmanında hata mesajı map edilerek kullanıcıya gösterilsin.
- Asla sessizce swallow etme (en azından debug log).

## 6) Test Stratejisi (Sprint-0)
- Unit: util ve store
- Component: kritik auth form davranışları
- Pipeline: `lint + typecheck + test + build`

## 7) Klasör Referansı
```txt
src/
  app/
    (auth)/login
    (protected)/dashboard
  features/
    auth/
      api/
      components/
      model/
  shared/
    api/
    config/
    lib/
  test/
```
