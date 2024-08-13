import type { ActionInstances, Stages } from "db/public";
import { Button } from "ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "ui/dropdown-menu";
import { ChevronDown, Play } from "ui/icon";

import type { StagePub } from "~/lib/db/queries";
import { ActionRunFormWrapper } from "./ActionRunFormWrapper";

export type PageContext = {
	params: Record<string, unknown>;
	searchParams: Record<string, unknown>;
};

export const PubsRunActionDropDownMenu = ({
	actionInstances,
	pub,
	stage,
	pageContext,
}: {
	actionInstances: ActionInstances[];
	pub: StagePub;
	stage: Stages;
	pageContext: PageContext;
}) => {
	if (!actionInstances.length) {
		return null;
	}

	return (
		<DropdownMenu modal={true}>
			<DropdownMenuTrigger asChild>
				<Button className="flex items-center gap-x-2" variant="outline" size="sm">
					<Play size="12" />
					Run action
					<ChevronDown size="14" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{actionInstances.map((actionInstance) => (
					<ActionRunFormWrapper
						stage={stage}
						pub={pub}
						actionInstance={actionInstance}
						pageContext={pageContext}
						key={actionInstance.id}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};