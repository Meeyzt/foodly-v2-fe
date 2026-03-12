import Link from "next/link";

export default function Home() {
  return (
    <section className="card">
      <h1>Foodly v2 Frontend</h1>
      <p>Sprint-1 iskeleti hazır.</p>
      <Link href="/login">Login</Link>
    </section>
  );
}
