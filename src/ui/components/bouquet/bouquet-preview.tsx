"use client";

import { ImageIcon, Loader2 } from "lucide-react";
import { useBouquetStore } from "@/stores/bouquet-store";

export function BouquetPreview() {
	const generatedBouquetImage = useBouquetStore((s) => s.generatedBouquetImage);
	const isGenerating = useBouquetStore((s) => s.isGenerating);

	if (isGenerating) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="mt-3 text-sm text-muted-foreground">Generuji náhled kytice...</p>
				<p className="mt-1 text-xs text-muted-foreground">Může to trvat několik sekund</p>
			</div>
		);
	}

	if (!generatedBouquetImage) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
				<ImageIcon className="h-10 w-10 text-muted-foreground/50" />
				<p className="mt-3 text-sm text-muted-foreground">Náhled kytice</p>
				<p className="mt-1 max-w-xs text-xs text-muted-foreground">
					Vyberte květiny a klikněte na &ldquo;Vygenerovat kytici&rdquo; pro vytvoření AI náhledu
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-border bg-card">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={generatedBouquetImage}
				alt="Vygenerovaná kytice"
				className="aspect-square w-full object-cover"
			/>
			<div className="p-3">
				<p className="text-center text-xs text-muted-foreground">
					AI vygenerovaný náhled vaší kytice
				</p>
			</div>
		</div>
	);
}
