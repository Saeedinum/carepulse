import {z} from "zod";

export const UserFormValidation = z.object({
	name: z.string().min(2, "required").max(20, "required"),
	email: z.string().email("required"),
  phone : z.string()
});
