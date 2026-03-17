/**
 * Shared Logo Component — Zahradnictví Hnojice
 *
 * Text-based decorative logo with flower icon.
 * Matches the original zahradnictví design: ZA ✿ HRADNICTVÍ / NOJICE
 */

import { Flower2 } from "lucide-react";

interface LogoProps {
	className?: string;
	ariaLabel?: string;
	inverted?: boolean;
}

export const Logo = ({ className = "", ariaLabel = "Zahradnictví Hnojice", inverted = false }: LogoProps) => {
	const textColor = inverted ? "text-white" : "text-foreground dark:text-white";
	const flowerColor = inverted ? "text-pink-300" : "text-pink-500 dark:text-pink-400";

	return (
		<div className={`flex items-center gap-0.5 select-none ${className}`} aria-label={ariaLabel} role="img">
			<span className={`text-sm font-bold tracking-tight ${textColor} sm:text-base`}>
				ZA
			</span>
			<Flower2 className={`h-4 w-4 sm:h-5 sm:w-5 ${flowerColor}`} aria-hidden="true" />
			<span className={`text-sm font-bold tracking-tight ${textColor} sm:text-base`}>
				HRADNICTVÍ
			</span>
		</div>
	);
};
