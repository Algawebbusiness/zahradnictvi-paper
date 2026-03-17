"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { useBouquetStore } from "@/stores/bouquet-store";
import { FlowerPicker } from "./flower-picker";
import { BouquetCanvas } from "./bouquet-canvas";
import { BouquetPreview } from "./bouquet-preview";

export function BouquetBuilder() {
	// Rehydrate persisted store on mount (SSR safety)
	useEffect(() => {
		useBouquetStore.persist.rehydrate();
	}, []);

	return (
		<div className="mx-auto max-w-7xl px-4 py-6">
			{/* Header */}
			<div className="mb-6 flex items-center gap-3">
				<LinkWithChannel
					href="/"
					className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Zpět
				</LinkWithChannel>
				<h1 className="text-2xl font-bold">Tvorba vlastní kytice</h1>
			</div>

			{/* 3-column layout */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Column 1: Flower picker */}
				<div>
					<h2 className="mb-3 text-lg font-semibold">Vyberte květiny</h2>
					<FlowerPicker />
				</div>

				{/* Column 2: Selected flowers / canvas */}
				<div>
					<h2 className="mb-3 text-lg font-semibold">Vaše kytice</h2>
					<BouquetCanvas />
				</div>

				{/* Column 3: AI preview */}
				<div>
					<h2 className="mb-3 text-lg font-semibold">Náhled</h2>
					<BouquetPreview />
				</div>
			</div>
		</div>
	);
}
