import {ID} from "node-appwrite";
import { users } from "../config/appwrite.config"; 

export const createUser = async (user: CreateUserParams) => {
	try {
		const result = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
		console.log(result);
	} catch (error) {
		console.log(error);
	}
};
