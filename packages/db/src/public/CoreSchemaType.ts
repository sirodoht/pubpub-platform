// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Represents the enum public.CoreSchemaType */
export enum CoreSchemaType {
	String = "String",
	Boolean = "Boolean",
	Vector3 = "Vector3",
	DateTime = "DateTime",
	Email = "Email",
	URL = "URL",
	MemberId = "MemberId",
	FileUpload = "FileUpload",
}

/** Zod schema for CoreSchemaType */
export const coreSchemaTypeSchema = z.nativeEnum(CoreSchemaType);