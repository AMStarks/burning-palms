/**
 * Color palette presets for the site
 */

export type ColorPreset = {
  name: string
  description: string
  colors: {
    background: string
    foreground: string
    accent_orange: string
    accent_yellow: string
    accent_brown: string
    accent_dark: string
    link?: string
    button_primary?: string
    button_secondary?: string
  }
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Retro 70s (Default)",
    description: "Original retro 70s Australian surf palette",
    colors: {
      background: "#faf8f3",
      foreground: "#8b4513",
      accent_orange: "#ff6b35",
      accent_yellow: "#ffb347",
      accent_brown: "#a0522d",
      accent_dark: "#5d4037",
      link: "#ff6b35",
      button_primary: "#ff6b35",
      button_secondary: "#5d4037",
    },
  },
  {
    name: "Ocean Breeze",
    description: "Cool blues and teals inspired by the ocean",
    colors: {
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      accent_orange: "#0284c7",
      accent_yellow: "#06b6d4",
      accent_brown: "#075985",
      accent_dark: "#0e7490",
      link: "#0284c7",
      button_primary: "#0284c7",
      button_secondary: "#075985",
    },
  },
  {
    name: "Sunset Vibes",
    description: "Warm oranges and pinks like an Australian sunset",
    colors: {
      background: "#fff7ed",
      foreground: "#7c2d12",
      accent_orange: "#ea580c",
      accent_yellow: "#f97316",
      accent_brown: "#c2410c",
      accent_dark: "#9a3412",
      link: "#ea580c",
      button_primary: "#ea580c",
      button_secondary: "#9a3412",
    },
  },
  {
    name: "Eucalyptus Green",
    description: "Fresh greens inspired by Australian eucalyptus",
    colors: {
      background: "#f0fdf4",
      foreground: "#14532d",
      accent_orange: "#16a34a",
      accent_yellow: "#22c55e",
      accent_brown: "#15803d",
      accent_dark: "#166534",
      link: "#16a34a",
      button_primary: "#16a34a",
      button_secondary: "#166534",
    },
  },
  {
    name: "Desert Sands",
    description: "Warm earth tones and sandy colors",
    colors: {
      background: "#fefaf6",
      foreground: "#78350f",
      accent_orange: "#d97706",
      accent_yellow: "#f59e0b",
      accent_brown: "#92400e",
      accent_dark: "#713f12",
      link: "#d97706",
      button_primary: "#d97706",
      button_secondary: "#713f12",
    },
  },
  {
    name: "High Contrast",
    description: "Bold, high-contrast colors for maximum impact",
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      accent_orange: "#ff0000",
      accent_yellow: "#ffff00",
      accent_brown: "#8b4513",
      accent_dark: "#000000",
      link: "#ff0000",
      button_primary: "#ff0000",
      button_secondary: "#000000",
    },
  },
]

export function applyColorPreset(preset: ColorPreset): Record<string, string> {
  return {
    color_background: preset.colors.background,
    color_foreground: preset.colors.foreground,
    color_accent_orange: preset.colors.accent_orange,
    color_accent_yellow: preset.colors.accent_yellow,
    color_accent_brown: preset.colors.accent_brown,
    color_accent_dark: preset.colors.accent_dark,
    color_link: preset.colors.link || preset.colors.accent_orange,
    color_button_primary: preset.colors.button_primary || preset.colors.accent_orange,
    color_button_secondary: preset.colors.button_secondary || preset.colors.accent_dark,
  }
}
