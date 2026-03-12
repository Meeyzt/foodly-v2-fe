# Sprint-0 Task List — Foodly v2 FE

## Legend
- **ID**: benzersiz iş kimliği
- **Dependency**: önce tamamlanması gereken işler
- **DoD**: Definition of Done
- **Test Kriteri**: doğrulama adımı

---

## F0-001 — Proje İskeleti ve Standartlar
- **Açıklama:** Next.js + TypeScript iskeletinin finalize edilmesi, temel klasör yapısının oluşturulması.
- **Dependency:** Yok
- **DoD:** `app/features/shared/test` yapısı hazır, proje localde çalışır.
- **Test Kriteri:** `npm run dev` ile açılış sayfası görüntülenir.

## F0-002 — Quality Scripts
- **Açıklama:** lint, typecheck, test, build scriptlerinin package.json’a eklenmesi.
- **Dependency:** F0-001
- **DoD:** `lint`, `typecheck`, `test`, `build`, `check` scriptleri tanımlı.
- **Test Kriteri:** `npm run check` başarılı.

## F0-003 — Vitest Kurulumu
- **Açıklama:** Vitest konfigürasyonu, setup dosyası ve en az 1 örnek test.
- **Dependency:** F0-001
- **DoD:** `vitest.config.ts` + `src/test/setup.ts` + çalışan test dosyası mevcut.
- **Test Kriteri:** `npm run test` geçti.

## F0-004 — Env ve Config Standardı
- **Açıklama:** API base URL için env template ve config resolver.
- **Dependency:** F0-001
- **DoD:** `.env.example` ve `shared/config/env.ts` var; app env’den ayağa kalkıyor.
- **Test Kriteri:** API base URL değiştirildiğinde axios instance yeni değeri kullanır.

## F0-005 — API Client Omurgası
- **Açıklama:** Ortak axios client + request interceptor (token).
- **Dependency:** F0-004
- **DoD:** `shared/api/http-client.ts` merkezi kullanımda.
- **Test Kriteri:** Token mevcutken Authorization header eklenir.

## F0-006 — Auth Feature (Login)
- **Açıklama:** login form, auth api, session store.
- **Dependency:** F0-005
- **DoD:** Login form submit ile auth akışı tetiklenir, session store set edilir.
- **Test Kriteri:** Mock API ile başarılı login sonrası `/dashboard` yönlendirmesi.

## F0-007 — Route Guard
- **Açıklama:** Protected route’lar için Next middleware guard.
- **Dependency:** F0-006
- **DoD:** Token yoksa `/dashboard` erişimi `/login`’e redirect olur.
- **Test Kriteri:** Tarayıcıda doğrudan `/dashboard` çağrısı redirect verir.

## F0-008 — Dashboard Shell
- **Açıklama:** Giriş sonrası temel dashboard ekranı (placeholder metrik + nav).
- **Dependency:** F0-006, F0-007
- **DoD:** Dashboard erişilebilir ve shell görünür.
- **Test Kriteri:** Login sonrası dashboard içerikleri render olur.

## F0-009 — IA/Route Dökümantasyonu
- **Açıklama:** Route haritası ve bilgi mimarisinin belgelenmesi.
- **Dependency:** F0-001
- **DoD:** `docs/IA_ROUTES.md` tamam.
- **Test Kriteri:** Route listesi ile mevcut app route’ları çelişmiyor.

## F0-010 — PRD Draft
- **Açıklama:** Hedef kullanıcı, ana akışlar ve MVP kapsamının yazılması.
- **Dependency:** Yok
- **DoD:** `docs/PRD_DRAFT.md` tamam.
- **Test Kriteri:** PM/FE lead review onayı alınır.

## F0-011 — FE Architecture Doc
- **Açıklama:** state, api client, auth guard, error handling kararlarının belgelenmesi.
- **Dependency:** F0-002, F0-005, F0-007
- **DoD:** `docs/FE_ARCH.md` tamam.
- **Test Kriteri:** Kod organizasyonu dokümanla uyumlu.

## F0-012 — README Güncellemesi
- **Açıklama:** setup, scriptler, proje yapısı ve doküman linkleri README’e eklenmesi.
- **Dependency:** F0-002, F0-009, F0-010, F0-011
- **DoD:** README yeni ekip üyesinin 10 dakikada ayağa kaldıracağı netlikte.
- **Test Kriteri:** Temiz makinede README adımlarıyla başarılı kurulum.
