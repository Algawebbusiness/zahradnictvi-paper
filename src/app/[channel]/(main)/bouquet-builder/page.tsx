import { type Metadata } from "next";
import { BouquetBuilder } from "@/ui/components/bouquet/bouquet-builder";

export const metadata: Metadata = {
	title: "Tvorba vlastní kytice",
};

export default function BouquetBuilderPage() {
	return <BouquetBuilder />;
}
