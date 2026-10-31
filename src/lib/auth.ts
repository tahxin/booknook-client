import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import clientPromise from "./mongodb";

// If MongoDB client promise exists, obtain the DB instance
let db = undefined;
if (clientPromise) {
  try {
    const client = await clientPromise;
    db = client.db();
  } catch (e) {
    console.warn("MongoDB connection warning in auth:", e);
  }
}

export const auth = betterAuth({
  // Provide mongodb adapter when connected
  ...(db ? { database: mongodbAdapter(db) } : {}),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "booknook_super_secret_dev_key_32chars_min!",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [jwt()],
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
});
