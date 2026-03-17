import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export interface BouquetProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail?: { url: string; alt?: string } | null;
	pricing?: {
		priceRange?: {
			start?: { gross?: { amount: number; currency: string } } | null;
		} | null;
	} | null;
	variants?: Array<{ id: string; name?: string }> | null;
}

export interface SelectedFlower {
	product: BouquetProduct;
	quantity: number;
}

interface BouquetState {
	bouquetFlowers: SelectedFlower[];
	generatedBouquetImage: string | null;
	isGenerating: boolean;
	addFlowerToBouquet: (product: BouquetProduct) => void;
	removeFlowerFromBouquet: (productId: string) => void;
	updateFlowerQuantity: (productId: string, quantity: number) => void;
	generateBouquet: () => Promise<void>;
	clearBouquet: () => void;
}

// ============================================================================
// Store
// ============================================================================

export const useBouquetStore = create<BouquetState>()(
	persist(
		(set, get) => ({
			bouquetFlowers: [],
			generatedBouquetImage: null,
			isGenerating: false,

			addFlowerToBouquet: (product) =>
				set((state) => {
					const existing = state.bouquetFlowers.find((f) => f.product.id === product.id);
					if (existing) {
						return {
							bouquetFlowers: state.bouquetFlowers.map((f) =>
								f.product.id === product.id ? { ...f, quantity: f.quantity + 1 } : f,
							),
						};
					}
					return {
						bouquetFlowers: [...state.bouquetFlowers, { product, quantity: 1 }],
					};
				}),

			removeFlowerFromBouquet: (productId) =>
				set((state) => ({
					bouquetFlowers: state.bouquetFlowers.filter((f) => f.product.id !== productId),
				})),

			updateFlowerQuantity: (productId, quantity) =>
				set((state) => ({
					bouquetFlowers: state.bouquetFlowers.map((f) =>
						f.product.id === productId ? { ...f, quantity } : f,
					),
				})),

			generateBouquet: async () => {
				const { bouquetFlowers } = get();
				if (bouquetFlowers.length === 0) return;

				set({ isGenerating: true });

				try {
					const response = await fetch("/api/generate-bouquet", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							flowers: bouquetFlowers.map((f) => ({
								name: f.product.name,
								quantity: f.quantity,
								image: f.product.thumbnail?.url,
							})),
						}),
					});

					if (!response.ok) {
						throw new Error(`Failed to generate bouquet: ${response.status}`);
					}

					const data = (await response.json()) as { image: string | null; message: string };
					set({ generatedBouquetImage: data.image });
				} catch (error) {
					console.error("Error generating bouquet:", error);
				} finally {
					set({ isGenerating: false });
				}
			},

			clearBouquet: () => set({ bouquetFlowers: [], generatedBouquetImage: null }),
		}),
		{
			name: "bouquet-storage",
			skipHydration: true,
			partialize: (state) => ({
				bouquetFlowers: state.bouquetFlowers,
			}),
		},
	),
);
