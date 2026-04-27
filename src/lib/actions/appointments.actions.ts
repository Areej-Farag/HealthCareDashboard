"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENTS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { getPatient } from "./patient.actions";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointmentData: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      ID.unique(),
      {
        ...appointmentData,
      },
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      [Query.equal("$id", appointmentId)],
    );

    return parseStringify(appointment.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointmentsList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.documents.reduce((acc, appointment) => {
      if (appointment.status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (appointment.status === "pending") {
        acc.pendingCount += 1;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.total,
      appointments: appointments.documents,
      ...counts,
    };
    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENTS_COLLECTION_ID!,
      appointmentId,
      {
        ...appointment,
      },
    );

    if (!updatedAppointment) {
      throw new Error("Failed to update appointment");
    }

    const smsMessage = `Hi, it's carePulse.
    ${
      type === "schedule"
        ? `your appointment is scheduled for ${formatDateTime(appointment.schedule).dateTime} with doctor ${appointment.primaryPhysician}.`
        : `We regret to inform you that Your appointment has been cancelled.
      Reason: ${appointment.cancellationReason}
      `
    }
    `;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Update appointment error:", error); // use console.error
    throw error; // ✅ Re-throw so the client catch block receives it
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSMS(
      ID.unique(),
      content,
      [],
      [userId],
    );

    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};
