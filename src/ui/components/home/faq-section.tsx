"use client";

import { useTranslations } from "@/lib/i18n";
import {
	Accordion,
	AccordionItemWithContext as AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/ui/components/ui/accordion";

const faqKeys = ["delivery", "freshness", "returns", "payment", "custom"] as const;

export function FAQSection() {
	const t = useTranslations("faq");

	return (
		<section className="bg-muted/5 px-4 py-8">
			<h2 className="mb-6 text-2xl font-bold">{t("title")}</h2>
			<Accordion type="single" className="w-full">
				{faqKeys.map((key) => (
					<AccordionItem key={key} value={key}>
						<AccordionTrigger className="text-left">{t(`${key}.question`)}</AccordionTrigger>
						<AccordionContent className="text-muted-foreground">{t(`${key}.answer`)}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
}
