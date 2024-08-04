"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CreateAppointmentSchema} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import Image from "next/image";
import {Doctors} from "@/constants";
import ReactDatePicker from "react-datepicker";
import {Textarea} from "../ui/textarea";
import {createAppointment} from "@/lib/actions/appointment.actions";

export function AppointmentForm({patientid, type = "create", userID}: {patientid: string; type: "create" | "cancel"; userID: string}) {
	const router = useRouter();
	const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
		resolver: zodResolver(CreateAppointmentSchema),
		defaultValues: {
			primaryPhysician: "",
			schedule: new Date(),
			reason: "",
			note: "",
		},
	});

	async function onSubmit(values: z.infer<typeof CreateAppointmentSchema>) {
		let status;
		switch (type) {
			// case "schedule":
			//   status = "scheduled";
			//   break;
			case "cancel":
				status = "cancelled";
				break;
			default:
				status = "pending";
		}

		try {
			if (type === "create" && patientid) {
				const appointment = {
					userID,
					patient: patientid,
					primaryPhysician: values.primaryPhysician,
					schedule: new Date(values.schedule),
					reason: values.reason!,
					status: status as Status,
					note: values.note,
				};

				const newAppointment = await createAppointment(appointment);

				if (newAppointment) {
					form.reset();
					router.push(`/patients/${userID}/new-appointment/success?appointmentId=${newAppointment.$id}`);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 flex-1'>
				<section className='mb-12 space-y-4'>
					<h1 className='header'>new Appointment</h1>
					<p className='text-dark-700'>Schedule your first appointment.</p>
				</section>

				<FormField
					control={form.control}
					name='primaryPhysician'
					render={({field}) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className='shad-select-trigger'>
											<SelectValue placeholder={"Select a doctor"} />
										</SelectTrigger>
									</FormControl>
									<SelectContent className='shad-select-content'>
										{Doctors.map((doctor, i) => (
											<SelectItem key={doctor.name + i} value={doctor.name}>
												<div className='flex cursor-pointer items-center gap-2'>
													<Image src={doctor.image} width={32} height={32} alt='doctor' className='rounded-full border border-dark-500' />
													<p>{doctor.name}</p>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				></FormField>
				<FormField
					control={form.control}
					name='schedule'
					render={({field}) => (
						<FormItem>
							<FormLabel>Date of Birth</FormLabel>
							<FormControl>
								<ReactDatePicker
									onChange={field.onChange}
									timeInputLabel='Time:'
									dateFormat={"MM/dd/yyyy"}
									wrapperClassName='date-picker'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
					<FormField
						control={form.control}
						name='reason'
						render={({field}) => (
							<FormItem>
								<FormLabel>Appointment reason</FormLabel>
								<FormControl>
									<Textarea placeholder={"Annual montly check-up"} {...field} className='shad-textArea' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='note'
						render={({field}) => (
							<FormItem>
								<FormLabel>Comments/notes</FormLabel>
								<FormControl>
									<Textarea placeholder={"Prefer afternoon appointments, if possible"} {...field} className='shad-textArea' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	);
}
