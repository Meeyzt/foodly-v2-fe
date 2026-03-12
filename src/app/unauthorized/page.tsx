import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <section className="card">
      <h1>Unauthorized</h1>
      <p>Bu role bu ekrana erişim yetkiniz yok.</p>
      <Link href="/login">Role değiştir</Link>
    </section>
  );
}
