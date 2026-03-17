import { Flower2, Sprout, Gift, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import csMessages from "@/messages/cs.json";

const t = csMessages.categories;

const categories = [
	{ id: "bouquets", nameKey: "lilies" as const, icon: Flower2, link: "/categories/konvalinky" },
	{ id: "plants", nameKey: "houseplants" as const, icon: Sprout, link: "/categories/pokojovky" },
	{ id: "gifts", nameKey: "gifts" as const, icon: Gift, link: "/categories/darky" },
	{ id: "occasions", nameKey: "special" as const, icon: Heart, link: "/categories/special" },
] as const;

export function QuickCategoryAccess() {
	return (
		<section className="px-4 py-6">
			<h2 className="mb-4 text-xl font-bold">{t.shopByCategory}</h2>
			<div className="grid grid-cols-4 gap-3">
				{categories.map((category) => (
					<LinkWithChannel
						key={category.id}
						href={category.link}
						className="group flex flex-col items-center gap-2"
					>
						<div
							className={cn(
								"flex h-16 w-16 items-center justify-center rounded-full bg-muted text-primary",
								"transition-all duration-200 group-hover:scale-105 group-hover:bg-muted/80",
							)}
						>
							<category.icon className="h-8 w-8" />
						</div>
						<span className="text-center text-xs font-medium">{t[category.nameKey]}</span>
					</LinkWithChannel>
				))}
			</div>
		</section>
	);
}
