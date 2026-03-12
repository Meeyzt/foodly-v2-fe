import Link from "next/link";

const mockOrders = [
  { id: "o101", status: "DELIVERED", amount: 410, reviewEligible: true },
  { id: "o102", status: "PREPARING", amount: 260, reviewEligible: false },
];

export default function OrdersPage() {
  return (
    <section className="card">
      <h1>Order History</h1>
      <ul>
        {mockOrders.map((order) => (
          <li key={order.id}>
            <Link href={`/customer/orders/${order.id}`}>{order.id}</Link> - {order.status} - {order.amount}₺
            {order.reviewEligible ? " | Review available" : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
