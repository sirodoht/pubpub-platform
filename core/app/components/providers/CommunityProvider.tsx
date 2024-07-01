"use client";

import { createContext, useContext } from "react";

import type { CommunityData } from "~/lib/server/community";

type Props = {
	children: React.ReactNode;
	community: CommunityData;
};

const CommunityContext = createContext<CommunityData>(undefined);

export function CommunityProvider({ children, community }: Props) {
	return <CommunityContext.Provider value={community}>{children}</CommunityContext.Provider>;
}

export const useCommunity = () => useContext(CommunityContext);
