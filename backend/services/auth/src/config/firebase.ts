import { cert, initializeApp } from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");

export const app = initializeApp({
  credential: cert(keyPath),
});