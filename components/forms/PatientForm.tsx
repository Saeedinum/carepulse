"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {UserFormValidation} from "@/lib/validation";

export function PatientForm() {
	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
		},
	});

	async function onSubmit({ name , email  , phone}: z.infer<typeof UserFormValidation>) {
		try {
			// const userData = { name, email, phone }
			// const User = await createUser(userData)
			// if(User) router.push(`/users/${User.id}/register`)
		} catch (error) {
			console.error(error);
			
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 flex-1'>
				<section className='mb-12 space-y-4'>
					<h1 className='header'>Hi there 😒</h1>
					<p className='text-dark-700'>Schedule your first appointment.</p>
				</section>

				<FormField
					control={form.control}
					name='name'
					render={({field}) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input placeholder='hamada omar' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='email'
					render={({field}) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='hamada@example.com' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='phone'
					render={({field}) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<PhoneInput
									placeholder='Enter phone number'
									value={field.value}
									onChange={field.onChange}
									defaultCountry='EG'
									international
									withCountryCallingCode
									className='input-phone'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
}
