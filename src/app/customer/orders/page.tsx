"use client";

import { useEffect, useMemo, useState } from "react";
import { customerApi, type OrderDTO } from "@/shared/api/contracts/customer";

type ReviewState = {
  rating: number;
  comment: string;
  loadingEligibility: boolean;
  eligible: boolean;
  reason?: string;
  submitting: boolean;
  success?: string;
  error?: string;
};

const defaultReviewState: ReviewState = {
  rating: 5,
  comment: "",
  loadingEligibility: false,
  eligible: false,
  submitting: false,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [activeOrderId, setActiveOrderId] = useState<string>();
  const [reviewState, setReviewState] = useState<ReviewState>(defaultReviewState);

  useEffect(() => {
    const run = async () => {
      try {
        const response = await customerApi.getOrderHistory();
        setOrders(response.data.data.items);
      } catch {
        setError("Could not fetch order history.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const activeOrder = useMemo(() => orders.find((order) => order.id === activeOrderId), [activeOrderId, orders]);

  const startReviewFlow = async (orderId: string) => {
    setActiveOrderId(orderId);
    setReviewState({ ...defaultReviewState, loadingEligibility: true });

    try {
      const eligibility = await customerApi.getReviewEligibility(orderId);
      setReviewState((prev) => ({
        ...prev,
        loadingEligibility: false,
        eligible: eligibility.data.data.eligible,
        reason: eligibility.data.data.reason,
      }));
    } catch {
      setReviewState((prev) => ({ ...prev, loadingEligibility: false, error: "Eligibility check failed." }));
    }
  };

  const submitReview = async () => {
    if (!activeOrderId) return;

    if (reviewState.comment.trim().length < 5) {
      setReviewState((prev) => ({ ...prev, error: "Comment must be at least 5 chars." }));
      return;
    }

    setReviewState((prev) => ({ ...prev, submitting: true, error: undefined, success: undefined }));

    try {
      const review = await customerApi.createReview(activeOrderId, {
        rating: reviewState.rating,
        comment: reviewState.comment.trim(),
      });

      setReviewState((prev) => ({
        ...prev,
        submitting: false,
        eligible: false,
        success: `Review submitted (${review.data.data.reviewId}).`,
      }));

      setOrders((prev) => prev.map((item) => (item.id === activeOrderId ? { ...item, reviewEligible: false } : item)));
    } catch {
      setReviewState((prev) => ({ ...prev, submitting: false, error: "Review submit failed." }));
    }
  };

  return (
    <section className="card">
      <h1>Order History</h1>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}
      <ul>
        {orders.map((order) => (
          <li key={order.id} style={{ marginBottom: 12 }}>
            {order.id} - {order.status} - {order.amount}₺
            {order.reviewEligible ? (
              <button type="button" onClick={() => void startReviewFlow(order.id)}>
                Write Review
              </button>
            ) : (
              <span style={{ marginLeft: 8 }}>Review unavailable</span>
            )}
          </li>
        ))}
      </ul>

      {activeOrder ? (
        <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 16, paddingTop: 16 }}>
          <h2>Review {activeOrder.id}</h2>
          {reviewState.loadingEligibility ? <p>Checking eligibility...</p> : null}
          {!reviewState.loadingEligibility && !reviewState.eligible ? <p>{reviewState.reason ?? "Not eligible"}</p> : null}
          {reviewState.eligible ? (
            <>
              <label>
                Rating
                <select
                  value={reviewState.rating}
                  onChange={(event) =>
                    setReviewState((prev) => ({ ...prev, rating: Number(event.target.value), error: undefined }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Comment
                <input
                  value={reviewState.comment}
                  onChange={(event) => setReviewState((prev) => ({ ...prev, comment: event.target.value, error: undefined }))}
                  placeholder="Share your feedback"
                />
              </label>
              <button type="button" disabled={reviewState.submitting} onClick={() => void submitReview()}>
                {reviewState.submitting ? "Submitting..." : "Submit Review"}
              </button>
            </>
          ) : null}

          {reviewState.error ? <p>{reviewState.error}</p> : null}
          {reviewState.success ? <p>{reviewState.success}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
