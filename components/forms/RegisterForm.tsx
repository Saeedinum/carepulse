"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {PatientFormValidation} from "@/lib/validation";
import {createUser, registerPatient} from "@/lib/actions/patient.actions";
import {useRouter} from "next/navigation";

import {Checkbox} from "../ui/checkbox";

import {useDropzone} from "react-dropzone";
import {FileUploader} from "../FileUploader";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Birthstone} from "next/font/google";

import ReactDatePicker from "react-datepicker";

export function RegisterForm({userid}: {userid: string}) {
	const router = useRouter();
	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			name: "John Doe",
			email: "johndoe@example.com",
			phone: "+12345678901",
			birthDate: new Date("1990-05-15"),
			gender: "Male",
			address: "1234 Elm Street, Springfield, IL",
			occupation: "Software Engineer",
			emergencyContactName: "Jane Doe",
			emergencyContactNumber: "+12345678902",
			primaryPhysician: "Dr. Emily Smith",
			insuranceProvider: "HealthCare Inc.",
			insurancePolicyNumber: "HC12345678",
			allergies: "Peanuts",
			currentMedication: "Aspirin",
			familyMedicalHistory: "Diabetes",
			pastMedicalHistory: "Hypertension",
			identificationType: "Birth Certificate",
			identificationNumber: "BC123456789",
			identificationDocument: undefined, // Assuming no file uploaded
			treatmentConsent: true,
			disclosureConsent: true,
			privacyConsent: true,
		},
	});

	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
		if (values.identificationDocument && values.identificationDocument.length > 0) {
			// const blobfile = new Blob([values.identificationDocument[0]], {type: values.identificationDocument[0].type});
			// const formData = new FormData();
			// formData.append("blobfile", blobfile);
			// formData.append("filename", values.identificationDocument[0].name);
			try {
				const patientData = {
					...values,
					userId: userid,
					identificationDocument: values.identificationDocument[0],
					birthDate: new Date(values.birthDate),
				};
				const patient = await registerPatient(patientData);
				if (patient) router.push(`/patients/${userid}/new-appointment`);
			} catch (error) {
				console.log(error);
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-12'>
				<section className='space-y-4'>
					<h1 className='header'>Welcome 👋</h1>
					<p className='text-dark-700'>Let us know more about yourself.</p>
				</section>
				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Personal Information</h2>
					</div>
					<FormField
						control={form.control}
						name='name'
						render={({field}) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder='John Doe' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='email'
							render={({field}) => (
								<FormItem>
									<FormLabel>Email address</FormLabel>
									<FormControl>
										<Input placeholder='johndoe@gmail.com' {...field} />
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
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder='(555) 123-4567' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='birthDate'
							render={({field}) => (
								<FormItem>
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<ReactDatePicker
											showTimeSelect={false}
											selected={field.value}
											// onChange={(date: Date) => field.onChange(date)}
											timeInputLabel='Time:'
											dateFormat={"MM/dd/yyyy"}
											wrapperClassName='date-picker'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='gender'
							render={({field}) => (
								<FormControl>
									<RadioGroup className='flex h-11 gap-6 xl:justify-between' onValueChange={field.onChange} defaultValue={field.value}>
										{["Male", "Female"].map((option, i) => (
											<div key={option + i} className='radio-group'>
												<RadioGroupItem value={option} id={option} />
												<FormLabel htmlFor={option} className='cursor-pointer'>
													{option}
												</FormLabel>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='address'
							render={({field}) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input placeholder='123 Main St' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='occupation'
							render={({field}) => (
								<FormItem>
									<FormLabel>Occupation</FormLabel>
									<FormControl>
										<Input placeholder='Software Engineer' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='emergencyContactName'
							render={({field}) => (
								<FormItem>
									<FormLabel>Emergency Contact Name</FormLabel>
									<FormControl>
										<Input placeholder='Jane Doe' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='emergencyContactNumber'
							render={({field}) => (
								<FormItem>
									<FormLabel>Emergency Contact Number</FormLabel>
									<FormControl>
										<Input placeholder='(555) 987-6543' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</section>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Medical Information</h2>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='insuranceProvider'
							render={({field}) => (
								<FormItem>
									<FormLabel>Insurance Provider</FormLabel>
									<FormControl>
										<Input placeholder='Health Insurance Co.' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='insurancePolicyNumber'
							render={({field}) => (
								<FormItem>
									<FormLabel>Insurance Policy Number</FormLabel>
									<FormControl>
										<Input placeholder='1234567890' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='allergies'
							render={({field}) => (
								<FormItem>
									<FormLabel>Allergies</FormLabel>
									<FormControl>
										<Input placeholder='Peanuts' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='currentMedication'
							render={({field}) => (
								<FormItem>
									<FormLabel>Current Medications</FormLabel>
									<FormControl>
										<Input placeholder='Ibuprofen' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='flex flex-col gap-6 xl:flex-row'>
						<FormField
							control={form.control}
							name='familyMedicalHistory'
							render={({field}) => (
								<FormItem>
									<FormLabel>Family Medical History</FormLabel>
									<FormControl>
										<Input placeholder='Diabetes, Heart Disease' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='pastMedicalHistory'
							render={({field}) => (
								<FormItem>
									<FormLabel>Past Medical History</FormLabel>
									<FormControl>
										<Input placeholder='Surgery, Chronic Illnesses' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</section>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Identification and Verification</h2>
					</div>

					<FormField
						control={form.control}
						name='identificationNumber'
						render={({field}) => (
							<FormItem>
								<FormLabel>Identification Number</FormLabel>
								<FormControl>
									<Input placeholder='ID Number' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='identificationDocument'
						render={({field}) => (
							<FormItem>
								<FormLabel>Scanned Copy of Identification Document</FormLabel>
								<FormControl>
									<FileUploader files={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</section>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Consent and Privacy</h2>
					</div>
					<FormField
						control={form.control}
						name='treatmentConsent'
						render={({field}) => (
							<FormItem>
								<FormControl>
									<div className='flex items-center gap-4'>
										<Checkbox id={"treatmentConsent"} checked={field.value} onCheckedChange={field.onChange} />
										<label htmlFor={"treatmentConsent"} className='checkbox-label'>
											I love Egypt
										</label>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='disclosureConsent'
						render={({field}) => (
							<FormItem>
								<FormControl>
									<div className='flex items-center gap-4'>
										<Checkbox id={"disclosureConsent"} checked={field.value} onCheckedChange={field.onChange} />
										<label htmlFor={"disclosureConsent"} className='checkbox-label'>
											I love Egypt
										</label>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='privacyConsent'
						render={({field}) => (
							<FormItem>
								<FormControl>
									<div className='flex items-center gap-4'>
										<Checkbox id={"privacyConsent"} checked={field.value} onCheckedChange={field.onChange} />
										<label htmlFor={"privacyConsent"} className='checkbox-label'>
											I love Egypt
										</label>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
				</section>
				<Button type='submit'>Submit and Continue</Button>
			</form>
		</Form>
	);
}
