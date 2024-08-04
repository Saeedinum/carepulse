import {ID, Query} from "node-appwrite";
import {storage, users} from "../config/appwrite.config";
import {parseStringify} from "../utils";
import {database, config} from "../appwrite.config";

export const createUser = async (user: CreateUserParams) => {
	try {
		const result = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
		return result;
	} catch (error: any) {
		if (error && error?.code === 409) {
			const existingUser = await users.list([Query.equal("email", [user.email])]);
			return existingUser.users[0];
		}
		console.log(error);
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);
		return parseStringify(user);
	} catch (error) {
		console.log(error);
	}
};

export const getPatient = async (userId: string) => {
	try {
		const patients = await database.listDocuments(config.DATABASE_ID!, config.PATIENT_COLLECTION_ID!, [Query.equal("userId", [userId])]);

		return parseStringify(patients.documents[0]);
	} catch (error) {
		console.log(error);
	}
};

export const registerPatient = async ({identificationDocument, ...patientData}: RegisterUserParams) => {
	try {
		const file = await storage.createFile(config.BUCKET_ID as string, ID.unique(), identificationDocument);
		const patient = await database.createDocument(config.DATABASE_ID as string, config.PATIENT_COLLECTION_ID as string, ID.unique(), {
			identificationDocumentId: file?.$id ? file.$id : null,
			identificationDocumentUrl: file?.$id
				? `${config.ENDPOINT}/storage/buckets/${config.BUCKET_ID}/files/${file.$id}/view??project=${config.PROJECT_ID}`
				: null,
			...patientData,
		});
		return parseStringify(patient);
	} catch (error) {
		console.log(error);
	}
};
