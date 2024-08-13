export interface PubTitleProps {
	id: string;
	values: { field: { slug: string }; value: unknown }[] | Record<string, unknown>;
	createdAt: Date;
}

export const getPubTitle = (pub: PubTitleProps) => {
	const title = (
		Array.isArray(pub.values)
			? pub.values.find((value) => {
					return value.field.slug.includes("title") && value.value;
				})?.value
			: pub.values["pubpub:title"]
	) as string | undefined;
	const fallbackTitle = `Untitled Pub - ${new Date(pub.createdAt).toDateString()}`;
	return title ?? fallbackTitle;
};