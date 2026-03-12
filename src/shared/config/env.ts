const requiredEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    console.warn(`[env] Missing required environment variable: ${key}`);
  }
}

export const env = {
  apiBaseUrl: requiredEnv.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
};
