import * as sdk from "node-appwrite";

// Debug: log what you actually get (remove in production)
console.log(
  "PROJECT_ID:",
  process.env.APPWRITE_PROJECT_ID ? "✅ found" : "❌ missing",
);
console.log(
  "API_KEY:",
  process.env.APPWRITE_API_KEY ? "✅ found" : "❌ missing",
);

export const {
  APPWRITE_PROJECT_ID: PROJECT_ID,
  APPWRITE_API_KEY: API_KEY,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  PATIENTS_COLLECTION_ID,
  DOCTORS_COLLECTION_ID,
  APPOINTMENTS_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  APPWRITE_ENDPOINT: ENDPOINT,
} = process.env;

if (!PROJECT_ID || !API_KEY) {
  throw new Error("Missing required Appwrite environment variables");
}

const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT?.trim() || "https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
