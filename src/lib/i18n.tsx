"use client";

import { createContext, useContext, type ReactNode } from "react";
import csMessages from "@/messages/cs.json";
import enMessages from "@/messages/en.json";

type Messages = typeof csMessages;

const I18nContext = createContext<{ locale: string; messages: Messages }>({
	locale: "cs",
	messages: csMessages,
});

export function I18nProvider({
	locale = "cs",
	children,
}: {
	locale?: string;
	children: ReactNode;
}) {
	const msgs = locale === "en" ? enMessages : csMessages;
	return <I18nContext.Provider value={{ locale, messages: msgs }}>{children}</I18nContext.Provider>;
}

/**
 * Client-side translation hook.
 * Usage: const t = useTranslations("faq");
 *        t("title") → "Často kladené otázky"
 *        t("delivery.question") → "Jak rychle doručujete?"
 */
export function useTranslations(namespace?: string) {
	const { messages } = useContext(I18nContext);

	// Get the namespace object
	const nsObj = namespace ? getNestedValue(messages, namespace) : messages;

	return function t(key: string): string {
		const val = getNestedValue(nsObj, key);
		return typeof val === "string" ? val : key;
	};
}

function getNestedValue(obj: unknown, path: string): unknown {
	return path.split(".").reduce<unknown>((current, segment) => {
		if (current && typeof current === "object" && segment in (current as Record<string, unknown>)) {
			return (current as Record<string, unknown>)[segment];
		}
		return undefined;
	}, obj);
}
