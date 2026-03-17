import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { executePublicGraphQL } from "@/lib/graphql";
import { PageListDocument } from "@/gql/graphql";
import { parseEditorJSToText } from "@/lib/editorjs";
import { BlogCard } from "@/ui/components/blog/blog-card";
import csMessages from "@/messages/cs.json";

const BLOG_PAGE_TYPE_SLUG = "blog";
const PAGES_PER_PAGE = 20;

export const metadata: Metadata = {
	title: "Blog — Zahradnictví Hnojice",
	description: "Tipy pro zahrádkáře, novinky a inspirace z našeho zahradnictví.",
};

interface PageNode {
	id: string;
	slug: string;
	title: string;
	created: string;
	content?: string | null;
	pageType: {
		slug: string;
	};
}

async function getBlogPages(): Promise<PageNode[]> {
	"use cache";
	cacheLife("minutes");
	cacheTag("blog-pages");

	const result = await executePublicGraphQL(PageListDocument, {
		variables: {
			first: PAGES_PER_PAGE,
		},
		revalidate: 300,
	});

	if (!result.ok) {
		console.error("[Blog] Failed to fetch pages:", result.error.message);
		return [];
	}

	const allPages = result.data.pages?.edges.map(({ node }) => node) ?? [];

	// Filter to only blog page type; if none match, return all pages as fallback
	const blogPages = allPages.filter(
		(page) => page.pageType.slug === BLOG_PAGE_TYPE_SLUG,
	);

	return blogPages.length > 0 ? blogPages : allPages;
}

function getExcerpt(content: string | null | undefined, maxLength = 160): string | null {
	const text = parseEditorJSToText(content);
	if (!text) return null;
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trimEnd() + "...";
}

export default async function BlogListingPage() {
	const pages = await getBlogPages();

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<header className="mb-10">
				<h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
					Blog
				</h1>
				<p className="mt-2 text-lg text-neutral-600">
					Tipy pro zahrádkáře, novinky a inspirace z našeho zahradnictví.
				</p>
			</header>

			{pages.length === 0 ? (
				<p className="text-neutral-500">
					{csMessages.common.noResults}
				</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{pages.map((page) => (
						<BlogCard
							key={page.id}
							title={page.title}
							slug={page.slug}
							date={page.created}
							excerpt={getExcerpt(page.content)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
