import { MapPin, Clock, Phone, Leaf, ArrowRight } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import csMessages from "@/messages/cs.json";

const t = csMessages.about;

const infoCards = [
	{ icon: Leaf, titleKey: "localGrower" as const, descKey: "localGrowerDesc" as const },
	{ icon: MapPin, titleKey: "location" as const, descKey: "locationRegion" as const },
	{ icon: Clock, titleKey: "openingHours" as const, descKey: "openingHoursValue" as const },
	{ icon: Phone, titleKey: "contact" as const, descKey: "contactValue" as const },
] as const;

export function AboutSection() {
	return (
		<section className="bg-muted/30 px-4 py-8">
			<div className="mx-auto mb-8 max-w-2xl text-center">
				<h2 className="mb-4 text-2xl font-bold">{t.title}</h2>
				<p className="mb-4 leading-relaxed text-muted-foreground">{t.description}</p>
				<LinkWithChannel
					href="/pages/about"
					className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
				>
					{t.learnMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
				</LinkWithChannel>
			</div>

			<div className="mx-auto grid max-w-lg grid-cols-2 gap-4">
				{infoCards.map((card) => (
					<div key={card.titleKey} className="rounded-lg bg-background/80 p-4 backdrop-blur-sm">
						<div className="flex flex-col items-center gap-2 text-center">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<card.icon className="h-5 w-5 text-primary" aria-hidden="true" />
							</div>
							<h3 className="text-sm font-semibold">{t[card.titleKey]}</h3>
							<p className="text-xs text-muted-foreground">{t[card.descKey]}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
