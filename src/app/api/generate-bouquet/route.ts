import { NextResponse } from "next/server";

interface FlowerInput {
	name: string;
	quantity: number;
	image?: string;
}

interface GenerateBouquetRequest {
	flowers: FlowerInput[];
}

// TODO: Integrate with Gemini API for AI bouquet image generation
// Required: GEMINI_API_KEY environment variable
// The endpoint should:
// 1. Build a prompt describing the bouquet composition from the flowers array
// 2. Call Gemini's image generation API
// 3. Return the generated image as a base64 data URL or hosted URL

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as GenerateBouquetRequest;

		if (!body.flowers || !Array.isArray(body.flowers) || body.flowers.length === 0) {
			return NextResponse.json({ error: "At least one flower is required" }, { status: 400 });
		}

		// Validate each flower entry
		for (const flower of body.flowers) {
			if (!flower.name || typeof flower.name !== "string") {
				return NextResponse.json({ error: "Each flower must have a name" }, { status: 400 });
			}
			if (!flower.quantity || typeof flower.quantity !== "number" || flower.quantity < 1) {
				return NextResponse.json({ error: "Each flower must have a positive quantity" }, { status: 400 });
			}
		}

		// Placeholder response — requires GEMINI_API_KEY configuration
		return NextResponse.json({
			image: null,
			message: "Bouquet generation requires GEMINI_API_KEY configuration",
		});
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}
}
