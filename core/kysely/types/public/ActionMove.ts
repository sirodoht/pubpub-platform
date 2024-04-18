// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Insertable, type Selectable, type Updateable } from "kysely";

import { type PubsId } from "./Pubs";
import { type StagesId } from "./Stages";
import { type UsersId } from "./Users";

/** Identifier type for public.action_move */
export type ActionMoveId = string & { __brand: "ActionMoveId" };

/** Represents the table public.action_move */
export default interface ActionMoveTable {
	id: ColumnType<ActionMoveId, ActionMoveId | undefined, ActionMoveId>;

	source_stage_id: ColumnType<StagesId, StagesId, StagesId>;

	destination_stage_id: ColumnType<StagesId, StagesId, StagesId>;

	pub_id: ColumnType<PubsId, PubsId, PubsId>;

	user_id: ColumnType<UsersId, UsersId, UsersId>;

	note: ColumnType<string, string, string>;

	created_at: ColumnType<Date, Date | string | undefined, Date | string>;

	updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ActionMove = Selectable<ActionMoveTable>;

export type NewActionMove = Insertable<ActionMoveTable>;

export type ActionMoveUpdate = Updateable<ActionMoveTable>;