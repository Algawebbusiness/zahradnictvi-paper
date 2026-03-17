"use client";

import { Star } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

const reviewKeys = ["review1", "review2", "review3"] as const;

function TestimonialCard({ name, review, rating = 5 }: { name: string; review: string; rating?: number }) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="space-y-4 rounded-lg border border-border/50 bg-muted/30 p-6">
			<div className="flex items-center gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
					{initials}
				</div>
				<div className="flex-1">
					<p className="font-semibold text-foreground">{name}</p>
					<div className="mt-1 flex gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
						{Array.from({ length: rating }).map((_, i) => (
							<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
						))}
					</div>
				</div>
			</div>
			<p className="text-sm leading-relaxed text-muted-foreground">{review}</p>
		</div>
	);
}

export function TestimonialsSection() {
	const t = useTranslations("testimonials");

	return (
		<section className="px-4 py-8">
			<h2 className="mb-6 text-2xl font-bold">{t("title")}</h2>
			<div className="flex snap-x gap-4 overflow-x-auto pb-2 scrollbar-hide">
				{reviewKeys.map((key) => (
					<div key={key} className="w-[280px] flex-none snap-start">
						<TestimonialCard name={t(`${key}.name`)} review={t(`${key}.review`)} />
					</div>
				))}
			</div>
		</section>
	);
}
