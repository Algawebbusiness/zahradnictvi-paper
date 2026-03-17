"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

type BannerItem = {
	id: string;
	titleKey: string;
	subtitleKey?: string;
	image: string;
	imagePosition?: string;
	ctaLabelKey?: string;
	ctaHref?: string;
};

const banners: BannerItem[] = [
	{
		id: "1",
		titleKey: "deliverJoy",
		subtitleKey: "fragrantLilies",
		image: "/images/hero/konvalinky.avif",
		imagePosition: "center 25%",
		ctaLabelKey: "viewLilies",
		ctaHref: "/products?category=konvalinky",
	},
	{
		id: "2",
		titleKey: "funeralArrangements",
		image: "/images/hero/smutecni-vazba.jpg",
		imagePosition: "center 30%",
		ctaLabelKey: "browseOffer",
		ctaHref: "/products?category=smutecni",
	},
	{
		id: "3",
		titleKey: "specialOccasions",
		subtitleKey: "surpriseLovedOnes",
		image: "/images/hero/special-occasions.jpg",
	},
	{
		id: "4",
		titleKey: "bloomMonuments",
		image: "/images/hero/rozkvetle-pamatky.jpeg",
		ctaLabelKey: "discoverFloristry",
		ctaHref: "/products",
	},
];

export function HeroBanner() {
	const t = useTranslations("hero");
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi]);

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-xl sm:rounded-2xl" ref={emblaRef}>
				<div className="flex">
					{banners.map((banner) => (
						<div key={banner.id} className="min-w-0 flex-[0_0_100%]">
							<div
								className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1] md:aspect-[21/9]"
								style={{
									backgroundImage: `url(${banner.image})`,
									backgroundSize: "cover",
									backgroundPosition: banner.imagePosition || "center 85%",
								}}
							>
								<div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
								<div className="relative flex h-full flex-col items-center justify-center p-6 text-center text-white">
									<h2 className="mb-2 text-2xl font-bold drop-shadow-lg sm:text-3xl md:text-4xl">
										{t(banner.titleKey)}
									</h2>
									{banner.subtitleKey && (
										<p className="text-sm opacity-90 drop-shadow-md sm:text-base md:text-lg">
											{t(banner.subtitleKey)}
										</p>
									)}
									{banner.ctaLabelKey && banner.ctaHref && (
										<LinkWithChannel
											href={banner.ctaHref}
											className="mt-4 inline-block rounded-md bg-amber-100 px-6 py-2.5 text-sm font-medium text-amber-900 shadow-lg transition-colors hover:bg-amber-200"
										>
											{t(banner.ctaLabelKey)}
										</LinkWithChannel>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mt-4 flex justify-center gap-2">
				{banners.map((_, index) => (
					<button
						key={index}
						onClick={() => emblaApi?.scrollTo(index)}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							current === index ? "w-6 bg-primary" : "w-1.5 bg-muted",
						)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
