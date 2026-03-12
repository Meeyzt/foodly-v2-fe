let started = false;

export async function enableApiMocking() {
  if (started || typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;

  const { worker } = await import("@/test/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
  started = true;
}
