import { Header } from "~/app/c/(public)/[communitySlug]/public/Header";
import { findCommunityBySlug } from "~/lib/server/community";

type Props = { children: React.ReactNode; params: { communitySlug: string; formSlug: string } };

export default async function Layout({ children, params }: Props) {
	const community = await findCommunityBySlug(params.communitySlug);
	if (!community) {
		return null;
	}
	return (
		<div>
			<Header>
				<h1 className="text-xl font-bold">Evaluation for {community.name}</h1>
			</Header>
			<div className="container mx-auto">{children}</div>
		</div>
	);
}