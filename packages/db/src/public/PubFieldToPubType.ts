import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";
import { z } from "zod";

import type { PubFieldsId } from "./PubFields";
import type { PubTypesId } from "./PubTypes";
import { pubFieldsIdSchema } from "./PubFields";
import { pubTypesIdSchema } from "./PubTypes";

// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Represents the table public._PubFieldToPubType */
export interface PubFieldToPubTypeTable {
	A: ColumnType<PubFieldsId, PubFieldsId, PubFieldsId>;

	B: ColumnType<PubTypesId, PubTypesId, PubTypesId>;
}

export type PubFieldToPubType = Selectable<PubFieldToPubTypeTable>;

export type NewPubFieldToPubType = Insertable<PubFieldToPubTypeTable>;

export type PubFieldToPubTypeUpdate = Updateable<PubFieldToPubTypeTable>;

export const pubFieldToPubTypeSchema = z.object({
	A: pubFieldsIdSchema,
	B: pubTypesIdSchema,
});

export const pubFieldToPubTypeInitializerSchema = z.object({
	A: pubFieldsIdSchema,
	B: pubTypesIdSchema,
});

export const pubFieldToPubTypeMutatorSchema = z.object({
	A: pubFieldsIdSchema.optional(),
	B: pubTypesIdSchema.optional(),
});
