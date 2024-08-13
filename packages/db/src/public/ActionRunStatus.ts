// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from "zod";

/** Represents the enum public.ActionRunStatus */
export enum ActionRunStatus {
	success = "success",
	failure = "failure",
	scheduled = "scheduled",
}

/** Zod schema for ActionRunStatus */
export const actionRunStatusSchema = z.nativeEnum(ActionRunStatus);