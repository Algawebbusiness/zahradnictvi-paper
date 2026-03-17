/**
 * Brand Configuration
 *
 * Centralized branding settings for the storefront.
 * Update these values when customizing for a new store.
 *
 * @example
 * ```tsx
 * import { brandConfig } from "@/config/brand";
 *
 * <title>{brandConfig.siteName}</title>
 * <p>© {new Date().getFullYear()} {brandConfig.copyrightHolder}</p>
 * ```
 */

export const brandConfig = {
	/** Site name used in titles, metadata, and headers */
	siteName: "Zahradnictví Hnojice",

	/** Legal entity name for copyright notices */
	copyrightHolder: "Zahradnictví Hnojice",

	/** Organization name for structured data (JSON-LD) */
	organizationName: "Zahradnictví Hnojice",

	/** Default brand name for products without a brand */
	defaultBrand: "Zahradnictví Hnojice",

	/** Tagline/description for the store */
	tagline: "Čerstvé květiny a rostliny od lokálních pěstitelů. Doručení po celé ČR.",

	/** Homepage meta description */
	description: "Čerstvé květiny, kytice a rostliny od lokálních pěstitelů. Široký výběr pro každou příležitost. Doručení po celé ČR.",

	/** Logo aria-label for accessibility */
	logoAriaLabel: "Zahradnictví Hnojice",

	/** Title template - %s will be replaced with page title */
	titleTemplate: "%s | Zahradnictví Hnojice",

	/** Social media handles */
	social: {
		/** Twitter/X handle (without @) - set to null to disable */
		twitter: null as string | null,
		/** Instagram handle (without @) - set to null to disable */
		instagram: null as string | null,
		/** Facebook page URL - set to null to disable */
		facebook: "https://www.facebook.com/zahradnictvihnojice" as string | null,
	},
} as const;

/**
 * Helper to format page title using brand template.
 */
export function formatPageTitle(title: string): string {
	return brandConfig.titleTemplate.replace("%s", title);
}

/**
 * Get copyright text with specified year.
 * Use CopyrightText component for dynamic year in Server Components.
 */
export function getCopyrightText(year: number = new Date().getFullYear()): string {
	return `© ${year} ${brandConfig.copyrightHolder}. All rights reserved.`;
}
