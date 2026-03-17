"use client";

import { Minus, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { useBouquetStore } from "@/stores/bouquet-store";

export function BouquetCanvas() {
	const bouquetFlowers = useBouquetStore((s) => s.bouquetFlowers);
	const isGenerating = useBouquetStore((s) => s.isGenerating);
	const removeFlowerFromBouquet = useBouquetStore((s) => s.removeFlowerFromBouquet);
	const updateFlowerQuantity = useBouquetStore((s) => s.updateFlowerQuantity);
	const generateBouquet = useBouquetStore((s) => s.generateBouquet);
	const clearBouquet = useBouquetStore((s) => s.clearBouquet);

	if (bouquetFlowers.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
				<p className="text-sm text-muted-foreground">Zatím žádné květiny</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Vyberte květiny z katalogu vlevo
				</p>
			</div>
		);
	}

	const totalFlowers = bouquetFlowers.reduce((sum, f) => sum + f.quantity, 0);

	return (
		<div className="space-y-4">
			{/* Flower list */}
			<div className="space-y-2">
				{bouquetFlowers.map((flower) => (
					<div
						key={flower.product.id}
						className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
					>
						{/* Thumbnail */}
						{flower.product.thumbnail ? (
							<div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={flower.product.thumbnail.url}
									alt={flower.product.thumbnail.alt ?? flower.product.name}
									className="h-full w-full object-cover"
								/>
							</div>
						) : (
							<div className="h-12 w-12 flex-shrink-0 rounded-md bg-secondary" />
						)}

						{/* Name & price */}
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">{flower.product.name}</p>
							{flower.product.pricing?.priceRange?.start?.gross && (
								<p className="text-xs text-muted-foreground">
									{flower.product.pricing.priceRange.start.gross.amount.toLocaleString("cs-CZ")}{" "}
									{flower.product.pricing.priceRange.start.gross.currency}
								</p>
							)}
						</div>

						{/* Quantity controls */}
						<div className="flex items-center gap-1">
							<Button
								variant="outline-solid"
								size="icon"
								className="h-7 w-7"
								onClick={() =>
									updateFlowerQuantity(flower.product.id, Math.max(1, flower.quantity - 1))
								}
								disabled={flower.quantity <= 1}
								aria-label="Snížit množství"
							>
								<Minus className="h-3 w-3" />
							</Button>
							<span className="w-6 text-center text-sm font-medium">{flower.quantity}</span>
							<Button
								variant="outline-solid"
								size="icon"
								className="h-7 w-7"
								onClick={() => updateFlowerQuantity(flower.product.id, flower.quantity + 1)}
								aria-label="Zvýšit množství"
							>
								<Plus className="h-3 w-3" />
							</Button>
						</div>

						{/* Remove */}
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-muted-foreground hover:text-destructive"
							onClick={() => removeFlowerFromBouquet(flower.product.id)}
							aria-label={`Odebrat ${flower.product.name}`}
						>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				))}
			</div>

			{/* Summary */}
			<div className="rounded-lg border border-border bg-card p-3">
				<p className="text-sm text-muted-foreground">
					Celkem:{" "}
					<span className="font-medium text-foreground">
						{totalFlowers} {totalFlowers === 1 ? "květina" : totalFlowers < 5 ? "květiny" : "květin"}
					</span>
				</p>
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<Button
					variant="default"
					className="flex-1"
					onClick={() => void generateBouquet()}
					disabled={isGenerating}
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Generuji...
						</>
					) : (
						<>
							<Sparkles className="mr-2 h-4 w-4" />
							Vygenerovat kytici
						</>
					)}
				</Button>
				<Button variant="outline-solid" onClick={clearBouquet} disabled={isGenerating}>
					Vymazat
				</Button>
			</div>
		</div>
	);
}
