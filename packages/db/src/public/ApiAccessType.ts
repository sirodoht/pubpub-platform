// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Represents the enum public.ApiAccessType */
export enum ApiAccessType {
	read = "read",
	write = "write",
	archive = "archive",
}

/** Zod schema for ApiAccessType */
export const apiAccessTypeSchema = z.nativeEnum(ApiAccessType);