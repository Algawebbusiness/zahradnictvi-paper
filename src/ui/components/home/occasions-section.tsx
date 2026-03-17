import { Heart, Gift, CalendarHeart, Flower2, type LucideIcon } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import csMessages from "@/messages/cs.json";

const t = csMessages.occasions;

interface OccasionItem {
	icon: LucideIcon;
	titleKey: keyof typeof t;
	bgColor: string;
	link: string;
}

const occasions: OccasionItem[] = [
	{ icon: Heart, titleKey: "wedding", bgColor: "bg-rose-200 dark:bg-rose-800/60", link: "/products?occasion=wedding" },
	{
		icon: Gift,
		titleKey: "birthday",
		bgColor: "bg-amber-200 dark:bg-amber-800/60",
		link: "/products?occasion=birthday",
	},
	{
		icon: CalendarHeart,
		titleKey: "anniversary",
		bgColor: "bg-emerald-200 dark:bg-emerald-800/60",
		link: "/products?occasion=anniversary",
	},
	{
		icon: Flower2,
		titleKey: "sympathy",
		bgColor: "bg-indigo-200 dark:bg-indigo-800/60",
		link: "/products?occasion=sympathy",
	},
];

export function OccasionsSection() {
	return (
		<section className="px-4 py-8">
			<h2 className="mb-6 text-2xl font-bold">{t.shopByOccasion}</h2>
			<div className="grid grid-cols-2 gap-4">
				{occasions.map((occasion) => (
					<LinkWithChannel key={occasion.titleKey} href={occasion.link}>
						<div
							className={`${occasion.bgColor} cursor-pointer rounded-lg border-0 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border dark:border-white/10`}
						>
							<div className="flex flex-col items-center gap-3">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm dark:bg-white/15">
									<occasion.icon className="h-8 w-8 text-foreground" aria-hidden="true" />
								</div>
								<p className="text-center text-sm font-semibold text-foreground">{t[occasion.titleKey]}</p>
							</div>
						</div>
					</LinkWithChannel>
				))}
			</div>
		</section>
	);
}
