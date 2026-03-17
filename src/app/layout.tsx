import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { DraftModeNotification } from "@/ui/components/draft-mode-notification";
import { rootMetadata } from "@/lib/seo";
import { localeConfig } from "@/config/locale";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { I18nProvider } from "@/lib/i18n";

/**
 * Root metadata for the entire site.
 */
export const metadata = rootMetadata;

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang={localeConfig.htmlLang} className={`${GeistSans.variable} ${GeistMono.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				<I18nProvider locale={localeConfig.htmlLang}>
					{children}
					<Suspense>
						<DraftModeNotification />
					</Suspense>
					<SpeedInsights />
				</I18nProvider>
			</body>
		</html>
	);
}
