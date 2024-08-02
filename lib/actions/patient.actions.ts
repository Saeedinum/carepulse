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
		console.error(error);
	}
};

export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);
		return parseStringify(user);
	} catch (error) {
		console.error(error);
	}
};

export const registerPatient = async ({identificationDocument, ...patientData}: RegisterUserParams) => {
	try {
		// const inputFile = InputFile.fromBuffer(identificationDocument[0].get("blobFile") as Blob, identificationDocument[0].get("fileName") as string);
		const file = await storage.createFile(config.BUCKET_ID as string, ID.unique(), identificationDocument);
		const patient = await database.createDocument(config.DATABASE_ID as string, config.PATIENT_COLLECTION_ID as string, ID.unique(), {
			identificationDocumentId: file?.$id ? file.$id : null,
			identificationDocumentUrl: file?.$id
				? `${config.ENDPOINT}/storage/buckets/${config.BUCKET_ID}/files/${file.$id}/view??project=${config.PROJECT_ID}`
				: null,
			...patientData,
		});
		console.log(patient);
		return parseStringify(patient);
	} catch (error) {
		console.log(error);
	}
};
