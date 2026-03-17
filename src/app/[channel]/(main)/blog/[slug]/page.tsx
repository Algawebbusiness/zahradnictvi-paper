import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { executePublicGraphQL } from "@/lib/graphql";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { parseEditorJSToHtml, parseEditorJSToText } from "@/lib/editorjs";

// ============================================================================
// Cached Data Fetching
// ============================================================================

async function getBlogPost(slug: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag(`blog:${slug}`);

	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: decodeURIComponent(slug) },
		revalidate: 300,
	});

	if (!result.ok) {
		console.error(`[Blog] Failed to fetch page "${slug}":`, result.error.message);
		return null;
	}

	return result.data.page ?? null;
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata(props: {
	params: Promise<{ slug: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const page = await getBlogPost(params.slug);

	if (!page) {
		return { title: "Článek nenalezen" };
	}

	const description =
		page.seoDescription ||
		parseEditorJSToText(page.content)?.slice(0, 160) ||
		page.title;

	return {
		title: `${page.seoTitle || page.title} — Blog`,
		description,
		openGraph: {
			title: page.seoTitle || page.title,
			description,
			type: "article",
		},
	};
}

// ============================================================================
// Page Component
// ============================================================================

export default async function BlogDetailPage(props: {
	params: Promise<{ slug: string; channel: string }>;
}) {
	const params = await props.params;
	const page = await getBlogPost(params.slug);

	if (!page) {
		notFound();
	}

	const contentHtml = parseEditorJSToHtml(page.content);

	return (
		<article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
					{page.title}
				</h1>
			</header>

			{contentHtml && contentHtml.length > 0 ? (
				<div className="prose prose-neutral prose-lg max-w-none prose-headings:text-neutral-900 prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline">
					{contentHtml.map((html, index) => (
						<div key={index} dangerouslySetInnerHTML={{ __html: html }} />
					))}
				</div>
			) : (
				page.content && (
					<div className="prose prose-neutral prose-lg max-w-none">
						<p>{page.content}</p>
					</div>
				)
			)}
		</article>
	);
}
