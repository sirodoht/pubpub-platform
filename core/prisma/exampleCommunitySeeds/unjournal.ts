import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export default async function main(prisma: PrismaClient, communityUUID: string) {
	await prisma.community.create({
		data: {
			id: communityUUID,
			name: "Unjournal",
			slug: "unjournal",
			avatar: "/demo/unjournal.png",
		},
	});

	const fieldIds = [...Array(7)].map((x) => uuidv4());

	await prisma.pubField.createMany({
		data: [
			{ id: fieldIds[0], name: "Title" },
			{ id: fieldIds[1], name: "Description" },
			{ id: fieldIds[2], name: "Manager's Notes" },
			{ id: fieldIds[3], name: "Parent" },
			{ id: fieldIds[4], name: "Children" },
			{ id: fieldIds[5], name: "Content" },
			{ id: fieldIds[6], name: "Evaluated Paper" },
			{ id: fieldIds[7], name: "Tags" },
		],
	});

	const typeIds = [...Array(4)].map((x) => uuidv4());
	await prisma.pubType.create({
		data: {
			id: typeIds[0],
			name: "Submission",
			communityId: communityUUID,
			fields: {
				connect: [{ id: fieldIds[0] }, { id: fieldIds[1] }],
			},
		},
	});

	await prisma.pubType.create({
		data: {
			id: typeIds[1],
			name: "Evaluation Summary",
			communityId: communityUUID,
			fields: {
				connect: [
					{ id: fieldIds[0] },
					{ id: fieldIds[1] },
					{ id: fieldIds[2] },
					{ id: fieldIds[3] },
				],
			},
		},
	});

	await prisma.pubType.create({
		data: {
			id: typeIds[2],
			name: "Author Response",
			communityId: communityUUID,
			fields: {
				connect: [{ id: fieldIds[0] }, { id: fieldIds[1] }, { id: fieldIds[3] }],
			},
		},
	});
	await prisma.pubType.create({
		data: {
			id: typeIds[3],
			name: "Evaluation",
			communityId: communityUUID,
			fields: {
				connect: [{ id: fieldIds[0] }, { id: fieldIds[1] }, { id: fieldIds[3] }],
			},
		},
	});

	const submission1 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "Advance Market Commitments: Insights from Theory and Experience",
						},
						{
							fieldId: fieldIds[1],
							value: `Ten years ago, donors committed $1.5 billion to a pilot Advance Market Commitment (AMC) to help purchase pneumococcal vaccine for low-income countries. The AMC aimed to encourage the development of such vaccines, ensure distribution to children in low-income countries, and pilot the AMC mechanism for possible future use. Three vaccines have been developed and more than 150 million children immunized, saving an estimated 700,000 lives. This paper reviews the economic logic behind AMCs, the experience with the pilot, and key issues for future AMCs.`,
						},
					],
				},
			},
		},
	});

	const toAskForConsent = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "The Governance of Non-Profits and their Social Impact: Evidence from a Randomized Program in Healthcare in the Democratic Republic of Congo",
						},
						{
							fieldId: fieldIds[1],
							value: "Substantial funding is provided to the healthcare systems of low-income countries. However, an important challenge is to ensure that this funding be used efficiently. This challenge is complicated by the fact that a large share of healthcare services in low-income countries is provided by non-profit health centers that often lack i) effective governance structures and ii) organizational know-how and adequate training. In this paper, we argue that the bundling of performance-based incentives with auditing and feedback (A&F) is a potential way to overcome these obstacles. First, the combination of feedback and performance-based incentives—that is, feedback joint with incentives to act on this feedback and achieve specific health outcomes—helps address the knowledge gap that may otherwise undermine performance-based incentives. Second, coupling feedback with auditing helps ensure that the information underlying the feedback is reliable—a prerequisite for effective feedback. To examine the effectiveness of this bundle, we use data from a randomized governance program conducted in the Democratic Republic of Congo. Within the program, a set of health centers were randomly assigned to a “governance treatment” that consisted of performance-based incentives combined with A&F, while others were not. Consistent with our prediction, we find that the governance treatment led to i) higher operating efficiency and ii) improvements in health outcomes. Furthermore, we find that funding is not a substitute for the governance treatment—health centers that only receive funding increase their scale, but do not show improvements in operating efficiency nor health outcomes.",
						},
					],
				},
			},
		},
	});

	const toEvaluate = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "ADVANCE MARKET COMMITMENTS: INSIGHTS FROM THEORY AND EXPERIENCE",
						},
						{
							fieldId: fieldIds[1],
							value: `Ten years ago, donors committed $1.5 billion to a pilot Advance Market Commitment (AMC) to help purchase pneumococcal vaccine for low-income countries. The AMC aimed to encourage the development of such vaccines, ensure distribution to children in low-income countries, and pilot the AMC mechanism for possible future use. Three vaccines have been developed and more than 150 million children immunized, saving an estimated 700,000 lives. This paper reviews the economic logic behind AMCs, the experience with the pilot, and key issues for future AMCs.`,
						},
					],
				},
			},
		},
	});

	const evaluating1 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: 'Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China" (Buntaine et al)',
						},
						{
							fieldId: fieldIds[1],
							value: 'This will be evaluation 1 of "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China" - Revised 11 August because of a small oversight',
						},
					],
				},
			},
		},
	});

	const evaluating2 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "Artificial Intelligence and Economic Growth”: Philip Trammell",
						},
						{
							fieldId: fieldIds[1],
							value: `An evaluation of “Artificial Intelligence and Economic Growth” for Unjournal`,
						},
					],
				},
			},
		},
	});
	const authorRejection = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[0],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "Do Celebrity Endorsements Matter? A Twitter Experiment Promoting Vaccination In Indonesia",
						},
						{
							fieldId: fieldIds[1],
							value: `You haver to reject me. Pleseeee. Reject meeeeeeee`,
						},
					],
				},
			},
		},
	});
	const evaluationSummary1 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[1],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "Evaluation summary and metrics: “Artificial Intelligence and Economic Growth”",
						},
						{
							fieldId: fieldIds[1],
							value: `Summary, metrics and ratings, and Manager's comments on Evaluation of “Artificial Intelligence and Economic Growth” by Aghion et al.`,
						},
						{
							fieldId: fieldIds[2],
							value: "Ive never seen a squeaky wheel effect climate change",
						},
					],
				},
			},
		},
	});

	const evaluationSummary2 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[1],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: `Evaluation Summary and Metrics: "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China"`,
						},
						{
							fieldId: fieldIds[1],
							value: `Evaluation Summary and Metrics: "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China"`,
						},
						{
							fieldId: fieldIds[2],
							value: "Ive never seen an 'AI'. Prove it.",
						},
					],
				},
			},
		},
	});

	const authorsResponse = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[2],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: `Authors response to the Evaluation of "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China"`,
						},
						{
							fieldId: fieldIds[1],
							value: `Wealth. Fame. Power. The man who had acquired everything in this world, the Pirate King, Gol D. Roger. The final words that were said at his execution, sent people to the seas. "My wealth and treasures? If you want it, I'll let you have it. Look for it, I left it all at that place." Ever since, pirates from all over the world set sail for the Grand Line, searching for One Piece, the treasure that would make their dreams come true.`,
						},
					],
				},
			},
		},
	});

	const authorsResponse2 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[2],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: `Authors response to Evaluation 2 of “Artificial Intelligence and Economic Growth”: Philip Trammell`,
						},
						{
							fieldId: fieldIds[1],
							value: `You can beleive it or not, but i am telling you right now, that, that AI back there is is not real!`,
						},
					],
				},
			},
		},
	});
	const evaluation1 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[3],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: 'Evaluation 1 of "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China" (Buntaine et al)',
						},
						{
							fieldId: fieldIds[1],
							value: 'Evaluation 1 of "Does the Squeaky Wheel Get More Grease? The Direct and Indirect Effects of Citizen Participation on Environmental Governance in China" - Revised 11 August because of a small oversight',
						},
					],
				},
			},
		},
	});

	const evaluation2 = await prisma.pub.create({
		data: {
			pubTypeId: typeIds[3],
			communityId: communityUUID,
			values: {
				createMany: {
					data: [
						{
							fieldId: fieldIds[0],
							value: "Evaluation 2 of “Artificial Intelligence and Economic Growth”: Philip Trammell",
						},
						{
							fieldId: fieldIds[1],
							value: `Philip Trammell's Evaluation 2 of “Artificial Intelligence and Economic Growth” for Unjournal`,
						},
					],
				},
			},
		},
	});

	const stageIds = [...Array(7)].map((x) => uuidv4());
	await prisma.stage.createMany({
		data: [
			{ id: stageIds[0], communityId: communityUUID, name: "Submitted", order: "aa" },
			{
				id: stageIds[1],
				communityId: communityUUID,
				name: "Ask Author for Consent",
				order: "bb",
			},
			{
				id: stageIds[2],
				communityId: communityUUID,
				name: "To Evaluate",
				order: "cc",
			},
			{
				id: stageIds[3],
				communityId: communityUUID,
				name: "Under Evaluation",
				order: "dd",
			},
			{
				id: stageIds[4],
				communityId: communityUUID,
				name: "In Production",
				order: "ff",
			},
			{
				id: stageIds[5],
				communityId: communityUUID,
				name: "Published",
				order: "gg",
			},
			{
				id: stageIds[6],
				communityId: communityUUID,
				name: "Shelved",
				order: "hh",
			},
		],
	});

	await prisma.pub.update({
		where: { id: submission1.id },
		data: { stages: { connect: { id: stageIds[0] } } },
	});
	await prisma.pub.update({
		where: { id: toAskForConsent.id },
		data: { stages: { connect: { id: stageIds[1] } } },
	});
	await prisma.pub.update({
		where: { id: toEvaluate.id },
		data: { stages: { connect: { id: stageIds[2] } } },
	});
	await prisma.pub.update({
		where: { id: evaluating1.id },
		data: { stages: { connect: { id: stageIds[3] } } },
	});
	await prisma.pub.update({
		where: { id: evaluating2.id },
		data: { stages: { connect: { id: stageIds[3] } } },
	});
	await prisma.pub.update({
		where: { id: evaluationSummary1.id },
		data: { stages: { connect: { id: stageIds[4] } } },
	});
	await prisma.pub.update({
		where: { id: evaluationSummary2.id },
		data: { stages: { connect: { id: stageIds[4] } } },
	});
	await prisma.pub.update({
		where: { id: authorsResponse.id },
		data: { stages: { connect: { id: stageIds[4] } } },
	});
	await prisma.pub.update({
		where: { id: authorsResponse2.id },
		data: { stages: { connect: { id: stageIds[4] } } },
	});
	await prisma.pub.update({
		where: { id: evaluation1.id },
		data: { stages: { connect: { id: stageIds[5] } } },
	});
	await prisma.pub.update({
		where: { id: evaluation2.id },
		data: { stages: { connect: { id: stageIds[5] } } },
	});
	await prisma.pub.update({
		where: { id: authorRejection.id },
		data: { stages: { connect: { id: stageIds[6] } } },
	});

	const semanticScholarIntegration = await prisma.integration.create({
		data: {
			name: "Semantic Scholar",
			actions: [
				{
					text: "Add paper from Semantic Scholar",
					href: "https://integrations.pubpub.org/semanticscholar/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/semanticscholar/settings",
		},
	});

	const openAlexIntegration = await prisma.integration.create({
		data: {
			name: "OpenAlex",
			actions: [
				{
					text: "Add work from OpenAlex",
					href: "https://integrations.pubpub.org/semanticscholar/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/semanticscholar/settings",
		},
	});

	const crossrefIntegration = await prisma.integration.create({
		data: {
			name: "Crossref",
			actions: [
				{
					text: "Add work from Crossref",
					href: "https://integrations.pubpub.org/semanticscholar/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/semanticscholar/settings",
		},
	});

	const openCitationsInegration = await prisma.integration.create({
		data: {
			name: "Open Citations",
			actions: [
				{
					text: "Add work from open citation",
					href: "https://integrations.pubpub.org/opencitation/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/opencitation/settings",
		},
	});

	const keywordExtractionIntegration = await prisma.integration.create({
		data: {
			name: "Keyword Extraction",
			actions: [
				{
					text: "Extract Keywords",
					href: "https://integrations.pubpub.org/keyword/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/keyword/settings",
		},
	});

	const evaluationIntegration = await prisma.integration.create({
		data: {
			name: "Evaluation Manager",
			actions: [
				{
					text: "Manage Evaluation",
					href: "https://integrations.pubpub.org/evaluation/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/evaluation/settings",
		},
	});
	const siteIntegration = await prisma.integration.create({
		data: {
			name: "Site Builder",
			actions: [
				{
					text: "Manage Site",
					href: "https://integrations.pubpub.org/sitebuilder/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/sitebuilder/settings",
		},
	});

	const doiIntegration = await prisma.integration.create({
		data: {
			name: "DOI Registration",
			actions: [{ text: "Register DOI", href: "https://integrations.pubpub.org/doi/manage" }],
			settingsUrl: "https://integrations.pubpub.org/doi/settings",
		},
	});

	const socialMediaIntegration = await prisma.integration.create({
		data: {
			name: "Share",
			actions: [
				{
					text: "Share on social media",
					href: "https://integrations.pubpub.org/share/manage",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/share/settings",
		},
	});

	const archiveIntegration = await prisma.integration.create({
		data: {
			name: "Portico Archiver",
			actions: [
				{
					text: "Manage Archive",
					href: "https://integrations.pubpub.org/portico/manage",
				},
				{
					text: "Archive",
					href: "https://integrations.pubpub.org/portico/archive",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/portico/settings",
		},
	});

	const assignmentIntegration = await prisma.integration.create({
		data: {
			name: "Assignment Manager",
			actions: [
				{
					text: "Manage Assignments",
					href: "https://integrations.pubpub.org/assignment/manage",
				},
				{
					text: "Assign",
					href: "https://integrations.pubpub.org/assignment/assign",
				},
				{
					text: "(Un)Assign",
					href: "https://integrations.pubpub.org/assignment/assign",
				},
			],
			settingsUrl: "https://integrations.pubpub.org/assignment/settings",
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Semantic Scholar",
			integrationId: semanticScholarIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[0] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "OpenAlex",
			integrationId: openAlexIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[0] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Crossref",
			integrationId: crossrefIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[0] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Open Citations",
			integrationId: openCitationsInegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[0] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Keyword Extraction",
			integrationId: keywordExtractionIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[0] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "The Unjournal evaluation process manager",
			integrationId: evaluationIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[3] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "unjournal.evaluations.org",
			integrationId: siteIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[5] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Crossref DOI",
			integrationId: doiIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[5] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Share on Social Media",
			integrationId: socialMediaIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[5] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Unjournal Archive",
			integrationId: archiveIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[1] }, { id: stageIds[6] }],
			},
		},
	});

	await prisma.integrationInstance.create({
		data: {
			name: "Unjournal Assignment Manager",
			integrationId: assignmentIntegration.id,
			communityId: communityUUID,
			stages: {
				connect: [{ id: stageIds[2] }, { id: stageIds[6] }],
			},
		},
	});

	/**I have not thought about how these fields are used well enough */
	// const integrationFieldIds = [...Array(2)].map((x) => uuidv4());
	// await prisma.pubField.createMany({
	// 	data: [
	// 		{
	// 			id: integrationFieldIds[0],
	// 			name: "sitebuilder/status",
	// 			integrationId: siteIntegration.id,
	// 		},
	// 		{
	// 			id: integrationFieldIds[1],
	// 			name: "evaluation/status",
	// 			integrationId: evaluationIntegration.id,
	// 		},
	// 	],
	// });

	// await prisma.pubValue.createMany({
	// 	data: [
	// 		{
	// 			pubId: parentPub2.id,
	// 			fieldId: integrationFieldIds[0],
	// 			value: { color: "#72BE47", text: "unjournal summaries and metrics site built" },
	// 		},
	// 		{
	// 			pubId: parentPub2.id,
	// 			fieldId: integrationFieldIds[0],
	// 			value: { color: "#72BE47", text: "Author's Responses to evaluations site built" },
	// 		},
	// 		{
	// 			pubId: evaluation1.id,
	// 			fieldId: integrationFieldIds[1],
	// 			value: {
	// 				color: "#E1C04C",
	// 				text: "Collecting responses, summaries, and statistics",
	// 			},
	// 		},
	// 		{
	// 			pubId: evaluation2.id,
	// 			fieldId: integrationFieldIds[1],
	// 			value: {
	// 				color: "#E1C04C",
	// 				text: "Collecting responses, summaries, and statistics",
	// 			},
	// 		},
	// 	],
	// });
}