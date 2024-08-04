"use server";

import {revalidatePath} from "next/cache";
import {ID, Query} from "node-appwrite";
import {Appointment} from "@/types/appwrite.types";
import {config, database, messaging} from "../appwrite.config";
import {formatDateTime, parseStringify} from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
	try {
		const newAppointment = await database.createDocument(config.DATABASE_ID!, config.APPOINTMENT_COLLECTION_ID!, ID.unique(), appointment);
		return parseStringify(newAppointment);
	} catch (error) {
		console.error("An error occurred while creating a new appointment:", error);
	}
};

export const getRecentAppointmentList = async () => {
	try {
		const appointments = await database.listDocuments(config.DATABASE_ID!, config.APPOINTMENT_COLLECTION_ID!, [Query.orderDesc("$createdAt")]);

		const initialCounts = {
			scheduledCount: 0,
			pendingCount: 0,
			cancelledCount: 0,
		};

		const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
			switch (appointment.status) {
				case "scheduled":
					acc.scheduledCount++;
					break;
				case "pending":
					acc.pendingCount++;
					break;
				case "cancelled":
					acc.cancelledCount++;
					break;
			}
			return acc;
		}, initialCounts);

		const data = {
			totalCount: appointments.total,
			...counts,
			documents: appointments.documents,
		};

		return parseStringify(data);
	} catch (error) {
		console.error("An error occurred while retrieving the recent appointments:", error);
	}
};

export const sendSMSNotification = async (userId: string, content: string) => {
	try {
		const message = await messaging.createSms(ID.unique(), content, [], [userId]);
		return parseStringify(message);
	} catch (error) {
		console.error("An error occurred while sending sms:", error);
	}
};

export const updateAppointment = async ({appointmentId, userId, timeZone, appointment, type}: UpdateAppointmentParams) => {
	try {
		const updatedAppointment = await database.updateDocument(config.DATABASE_ID!, config.APPOINTMENT_COLLECTION_ID!, appointmentId, appointment);

		if (!updatedAppointment) throw Error;

		const smsMessage = `Greetings from CarePulse. ${
			type === "schedule"
				? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}`
				: `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason:  ${
						appointment.cancellationReason
				  }`
		}.`;
		await sendSMSNotification(userId, smsMessage);

		revalidatePath("/admin");
		return parseStringify(updatedAppointment);
	} catch (error) {
		console.error("An error occurred while scheduling an appointment:", error);
	}
};

export const getAppointment = async (appointmentId: string) => {
	try {
		const appointment = await database.getDocument(config.DATABASE_ID!, config.APPOINTMENT_COLLECTION_ID!, appointmentId);

		return parseStringify(appointment);
	} catch (error) {
		console.error("An error occurred while retrieving the existing patient:", error);
	}
};
