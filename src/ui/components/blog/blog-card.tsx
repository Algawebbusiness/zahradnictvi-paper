"use client";

import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

interface BlogCardProps {
	title: string;
	slug: string;
	date: string;
	excerpt?: string | null;
}

function formatDate(dateString: string): string {
	try {
		return new Intl.DateTimeFormat("cs-CZ", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(new Date(dateString));
	} catch {
		return dateString;
	}
}

export function BlogCard({ title, slug, date, excerpt }: BlogCardProps) {
	return (
		<LinkWithChannel
			href={`/blog/${slug}`}
			className="group block rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
		>
			<time dateTime={date} className="text-sm text-neutral-500">
				{formatDate(date)}
			</time>
			<h2 className="mt-2 text-xl font-semibold text-neutral-900 group-hover:text-green-700 transition-colors">
				{title}
			</h2>
			{excerpt && (
				<p className="mt-3 line-clamp-3 text-neutral-600">{excerpt}</p>
			)}
			<span className="mt-4 inline-block text-sm font-medium text-green-700 group-hover:underline">
				Číst dále &rarr;
			</span>
		</LinkWithChannel>
	);
}
