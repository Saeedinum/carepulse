import * as sdk from "node-appwrite";

const config = {
	PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
	API_KEY: process.env.NEXT_PUBLIC_API_KEY,
	DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
	PATIENT_COLLECTION_ID: process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID,
	DOCTOR_COLLECTION_ID: process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID,
	APPOINTMENT_COLLECTION_ID: process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID,
	NEXT_PUBLIC_BUCKET_ID: process.env.NEXT_PUBLIC_BUCKET_ID,
	NEXT_PUBLIC_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
	NEXT_PUBLIC_ADMIN_PASSKEY: process.env.NEXT_PUBLIC_ADMIN_PASSKEY,
};

const client = new sdk.Client();
client.setEndpoint(config.NEXT_PUBLIC_ENDPOINT!).setProject(config.PROJECT_ID!).setKey(config.API_KEY!);

export const database = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
