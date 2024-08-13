import type { ActionInstances, CommunitiesId, PubsId, Stages } from "db/public";

import type { PageContext } from "./PubsRunActionDropDownMenu";
import type { Action, ActionInstanceOf } from "~/actions/types";
import type { StagePub } from "~/lib/db/queries";
import { resolveFieldConfig } from "~/actions/_lib/custom-form-field/resolveFieldConfig";
import { ActionRunForm } from "./ActionRunForm";

export const ActionRunFormWrapper = async ({
	actionInstance,
	pub,
	stage,
	pageContext,
}: {
	actionInstance: ActionInstances;
	pub: StagePub;
	stage: Stages;
	pageContext: PageContext;
}) => {
	const resolvedFieldConfig = await resolveFieldConfig(actionInstance.action, "params", {
		pubId: pub.id as PubsId,
		stageId: stage.id,
		communityId: pub.communityId as CommunitiesId,
		actionInstance: actionInstance as ActionInstanceOf<Action>,
		pageContext,
	});

	return (
		<ActionRunForm
			actionInstance={actionInstance}
			pub={pub}
			fieldConfig={resolvedFieldConfig}
		/>
	);
};