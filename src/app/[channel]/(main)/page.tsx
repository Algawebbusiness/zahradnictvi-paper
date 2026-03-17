import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { ProductListByCollectionDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/product-list";
import { brandConfig } from "@/config/brand";
import { HeroBanner } from "@/ui/components/home/hero-banner";
import { QuickCategoryAccess } from "@/ui/components/home/quick-category-access";
import { OccasionsSection } from "@/ui/components/home/occasions-section";
import { FAQSection } from "@/ui/components/home/faq-section";
import { TestimonialsSection } from "@/ui/components/home/testimonials-section";
import { AboutSection } from "@/ui/components/home/about-section";
import { TrustBadges } from "@/ui/components/home/trust-badges";

export const metadata = {
	title: brandConfig.siteName,
	description: brandConfig.description,
};

async function getFeaturedProducts(channel: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag("collection:featured-products");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: 12,
			sortBy: { field: ProductOrderField.Collection, direction: OrderDirection.Asc },
		},
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn(`[Homepage] Failed to fetch featured products for ${channel}:`, result.error.message);
		return [];
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}

function ProductListSkeleton() {
	return (
		<ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 8 }).map((_, i) => (
				<li key={i} className="animate-pulse">
					<div className="aspect-square overflow-hidden rounded-lg bg-secondary" />
					<div className="mt-2 flex justify-between">
						<div>
							<div className="mt-1 h-4 w-32 rounded bg-secondary" />
							<div className="mt-1 h-4 w-20 rounded bg-secondary" />
						</div>
						<div className="mt-1 h-4 w-16 rounded bg-secondary" />
					</div>
				</li>
			))}
		</ul>
	);
}

export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<div className="min-h-screen pb-16">
			{/* Hero Banner */}
			<div className="px-4 pt-6">
				<HeroBanner />
			</div>

			{/* Quick Category Access */}
			<QuickCategoryAccess />

			{/* Featured Products */}
			<section className="mx-auto max-w-7xl px-4 py-8">
				<h2 className="sr-only">Product list</h2>
				<Suspense fallback={<ProductListSkeleton />}>
					<FeaturedProducts params={props.params} />
				</Suspense>
			</section>

			{/* Trust Badges */}
			<TrustBadges />

			{/* Shop by Occasion */}
			<OccasionsSection />

			{/* FAQ */}
			<FAQSection />

			{/* Testimonials */}
			<TestimonialsSection />

			{/* About */}
			<AboutSection />
		</div>
	);
}

async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return <ProductList products={products} />;
}
