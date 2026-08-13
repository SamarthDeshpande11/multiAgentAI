import { cert, initializeApp } from "firebase-admin";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT?.trim() ||
    readFileSync(
        join(
            dirname(fileURLToPath(import.meta.url)),
            "..",
            "serviceAccountKey.json",
        ),
        "utf8",
    );

const serviceAccount = JSON.parse(serviceAccountJson);

export const app = initializeApp({
    credential: cert(serviceAccount),
});