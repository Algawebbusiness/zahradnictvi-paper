"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { type BouquetProduct, useBouquetStore } from "@/stores/bouquet-store";

export function FlowerPicker() {
	const { channel } = useParams<{ channel?: string }>();
	const [products, setProducts] = useState<BouquetProduct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const addFlowerToBouquet = useBouquetStore((s) => s.addFlowerToBouquet);

	useEffect(() => {
		if (!channel) return;

		const fetchProducts = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/flowers?channel=${encodeURIComponent(channel)}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch: ${response.status}`);
				}
				const data = (await response.json()) as BouquetProduct[];
				setProducts(data);
			} catch (err) {
				console.error("Error fetching flowers:", err);
				setError("Nepodařilo se načíst květiny");
			} finally {
				setIsLoading(false);
			}
		};

		void fetchProducts();
	}, [channel]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				<span className="ml-2 text-sm text-muted-foreground">Načítání květin...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
				{error}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="py-8 text-center text-sm text-muted-foreground">Žádné květiny k dispozici</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
			{products.map((product) => {
				const price = product.pricing?.priceRange?.start?.gross;
				return (
					<div
						key={product.id}
						className="group relative overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
					>
						{product.thumbnail ? (
							<div className="aspect-square overflow-hidden bg-secondary">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={product.thumbnail.url}
									alt={product.thumbnail.alt ?? product.name}
									className="h-full w-full object-cover transition-transform group-hover:scale-105"
								/>
							</div>
						) : (
							<div className="aspect-square bg-secondary" />
						)}
						<div className="p-2">
							<p className="truncate text-sm font-medium">{product.name}</p>
							{price && (
								<p className="text-xs text-muted-foreground">
									{price.amount.toLocaleString("cs-CZ")} {price.currency}
								</p>
							)}
						</div>
						<Button
							variant="default"
							size="icon"
							className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => addFlowerToBouquet(product)}
							aria-label={`Přidat ${product.name} do kytice`}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				);
			})}
		</div>
	);
}
