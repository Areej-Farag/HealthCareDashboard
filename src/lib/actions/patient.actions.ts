"use server";
import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENTS_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";

export async function createUser(userData: CreateUserParams) {
  try {
    const newUser = await users.create(
      ID.unique(),
      userData.email,
      userData.phone,
      undefined,
      userData.name,
    );

    console.log("New user created:", newUser);

    // Serialize to plain object before returning
    return parseStringify(newUser);
  } catch (error: any) {
    if (error?.code === 409) {
      try {
        const existingUsers = await users.list([
          Query.equal("email", userData.email),
        ]);
        if (existingUsers.users && existingUsers.users.length > 0) {
          const user = existingUsers.users[0];
          console.log("Returning existing user:", user);
          return parseStringify(user);
        }
      } catch (listError) {
        console.error("Error listing users:", listError);
        throw listError;
      }
    }
    console.error("Unhandled error in createUser:", error);

    throw error;
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return JSON.stringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (patientId: string) => {
  try {
    const patient = await databases.listDocuments(
      DATABASE_ID!,
      PATIENTS_COLLECTION_ID!,
      [Query.equal("$id", patientId)],
    );

    return parseStringify(patient.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

// export const registerPatient = async ({
//   identificationDocument,
//   ...patientData
// }: RegisterUserParams) => {
//   try {
//     let file;
//     if (identificationDocument) {
//       const inputFile = InputFile.fromBuffer(
//         identificationDocument?.g("blobFile") as Blob,
//         identificationDocument?.get("fileName") as string,
//       );
//       file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
//     }

//     console.log(" identificationDocument", {
//       identificationDocument: file?.$id || null,
//       identificationUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
//     });

//     const patient = await databases.createDocument(
//       DATABASE_ID!,
//       PATIENTS_COLLECTION_ID!,
//       ID.unique(),
//       {
//         identificationDocument: file?.$id || null,
//         identificationUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
//         ...patientData,
//       },
//     );
//     return parseStringify(patient);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const registerPatient = async ({
  identificationDocument,
  ...patientData
}: RegisterUserParams) => {
  try {
    let identificationDocumentId = null;

    // Upload file to Storage if provided
    if (identificationDocument && identificationDocument.length > 0) {
      const file = identificationDocument[0];

      const uploadedFile = await storage.createFile(
        BUCKET_ID!,
        ID.unique(),
        file,
      );

      identificationDocumentId = uploadedFile.$id;
    }

    // Create patient document — only schema-defined attributes
    const patient = await databases.createDocument(
      DATABASE_ID!,
      PATIENTS_COLLECTION_ID!,
      ID.unique(),
      {
        ...patientData,
        identificationDocumentId, // Store file reference only
      },
    );

    console.log("New patient created:", patient);
    return parseStringify(patient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
    throw error;
  }
};
