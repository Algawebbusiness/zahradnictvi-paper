"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/ui/components/ui/button";

const themeOrder = ["light", "dark", "system"] as const;
type ThemeOption = (typeof themeOrder)[number];

const themeIcons: Record<ThemeOption, typeof Sun> = {
	light: Sun,
	dark: Moon,
	system: Monitor,
};

const themeLabels: Record<ThemeOption, string> = {
	light: "Světlý režim",
	dark: "Tmavý režim",
	system: "Systémový režim",
};

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="sm" className="h-9 w-9 p-0" disabled>
				<span className="sr-only">Přepnout režim</span>
			</Button>
		);
	}

	const current = (themeOrder.includes(theme as ThemeOption) ? theme : "system") as ThemeOption;
	const nextIndex = (themeOrder.indexOf(current) + 1) % themeOrder.length;
	const next = themeOrder[nextIndex];
	const Icon = themeIcons[current];

	return (
		<Button
			variant="ghost"
			size="sm"
			className="h-9 w-9 p-0"
			onClick={() => setTheme(next)}
			aria-label={themeLabels[current]}
			title={themeLabels[current]}
		>
			<Icon className="h-4 w-4" />
		</Button>
	);
}
