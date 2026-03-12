import { notFound } from "next/navigation";

const mockOrders = [
  { id: "o101", status: "DELIVERED", reviewEligible: true },
  { id: "o102", status: "PREPARING", reviewEligible: false },
];

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = mockOrders.find((o) => o.id === orderId);

  if (!order) return notFound();

  return (
    <section className="card">
      <h1>Order {order.id}</h1>
      <p>Status: {order.status}</p>
      {order.reviewEligible ? <button>Review Restaurant</button> : <p>Review not eligible yet.</p>}
    </section>
  );
}
