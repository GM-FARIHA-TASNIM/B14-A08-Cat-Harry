import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db("studiospace");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  appName: "StudioSpace",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  plugins: [jwt()],
});
