import { NextResponse } from "next/server";
import { executePublicGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const channel = searchParams.get("channel");

	if (!channel) {
		return NextResponse.json({ error: "channel query parameter is required" }, { status: 400 });
	}

	const result = await executePublicGraphQL(ProductListDocument, {
		variables: {
			first: 30,
			channel,
		},
	});

	if (!result.ok) {
		console.error("[API /flowers] GraphQL error:", result.error.message);
		return NextResponse.json({ error: "Failed to fetch products" }, { status: 502 });
	}

	const products =
		result.data.products?.edges.map(({ node }) => ({
			id: node.id,
			name: node.name,
			slug: node.slug,
			thumbnail: node.thumbnail,
			pricing: node.pricing,
			variants: node.variants?.map((v) => ({ id: v.id })),
		})) ?? [];

	return NextResponse.json(products);
}
