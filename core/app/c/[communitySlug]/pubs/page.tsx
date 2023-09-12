import { Prisma } from "@prisma/client";
import prisma from "~/prisma/db";
import { getLoginData } from "~/lib/auth/loginData";
import PubList from "./PubList";
import PubHeader from "./PubHeader";
import { createToken } from "~/lib/server/token";
import { pubInclude } from "~/lib/types";

const getCommunityPubs = async (communitySlug: string) => {
	const community = await prisma.community.findUnique({
		where: { slug: communitySlug },
	});
	if (!community) {
		return null;
	}
	return await prisma.pub.findMany({
		where: { communityId: community.id },
		include: {
			...pubInclude,
		},
	});
};

const getStages = async (communitySlug: string) => {
	const community = await prisma.community.findUnique({
		where: { slug: communitySlug },
	});
	if (!community) {
		return null;
	}
	// When trying to render the workflows a member can see. We look at the pubs they can see, get the workflows associated, and then show all those.
	return await prisma.stage.findMany({
		where: { communityId: community.id },
	});
};

type Props = { params: { communitySlug: string } };

export default async function Page({ params }: Props) {
	const loginData = await getLoginData();
	let token;
	if (loginData) {
		token = await createToken(loginData.id);
	}
	const pubs = await getCommunityPubs(params.communitySlug);
	if (!pubs) {
		return null;
	}
	const stages = await getStages(params.communitySlug);
	if (!stages) {
		return null;
	}
	return (
		<>
			<PubHeader />
			<PubList pubs={pubs} token={token} stages={stages} />
		</>
	);
}
