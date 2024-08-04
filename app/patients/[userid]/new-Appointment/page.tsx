import {AppointmentForm} from "@/components/forms/AppointmentForm";
import {getPatient} from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const NewAppointment = async ({params: {userid}}) => {
	const patient = await getPatient(userid);
	return (
		<div className='flex h-screen max-h-screen'>
			<section className='remove-scrollbar container my-auto'>
				<div className='sub-container max-w-[860px]'>
					<Image src='/assets/icons/logo-full.svg' height={1000} width={1000} alt='patient' className='mb-12 h-10 w-fit' />
					<AppointmentForm patientid={patient?.$id} type={"create"} userID={userid} />
				</div>
			</section>
			<Image src='/assets/images/appointment-img.png' height={1000} width={1000} alt='patient' className='side-img max-w-[50%]' />
		</div>
	);
};

export default NewAppointment;
