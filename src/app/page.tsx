import Link from "next/link";

export default function Home() {
  return (
    <section className="card">
      <h1>Foodly v2 Frontend</h1>
      <p>Production-grade starter scaffold is ready.</p>
      <Link href="/login">Go to Login</Link>
    </section>
  );
}
