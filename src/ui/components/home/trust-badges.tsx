import { Clock, Flower2, Shield, Phone } from "lucide-react";
import csMessages from "@/messages/cs.json";

const t = csMessages.trustBadges;

const badges = [
	{ icon: Clock, titleKey: "sameDayDelivery" as const, descKey: "ordersBefore14" as const },
	{ icon: Flower2, titleKey: "freshnessGuarantee" as const, descKey: "satisfactionGuaranteed" as const },
	{ icon: Shield, titleKey: "securePayment" as const, descKey: "sslEncryption" as const },
	{ icon: Phone, titleKey: "support247" as const, descKey: "hereForYou" as const },
] as const;

export function TrustBadges() {
	return (
		<section className="bg-muted/5 px-4 py-8">
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{badges.map((badge) => (
					<div key={badge.titleKey} className="flex flex-col items-center gap-2 p-4 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
							<badge.icon className="h-6 w-6" />
						</div>
						<div>
							<h3 className="text-sm font-semibold">{t[badge.titleKey]}</h3>
							<p className="text-xs text-muted-foreground">{t[badge.descKey]}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
