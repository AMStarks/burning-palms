"use client"

type TypographySettings = {
  bodyFont?: string
  displayFont?: string
  baseSize?: string
  baseWeight?: string
  headingWeight?: string
  lineHeight?: string
  letterSpacing?: string
}

type PageTypographyControlsProps = {
  settings: TypographySettings
  onChange: (settings: TypographySettings) => void
  useGlobalDefaults?: boolean
  onUseGlobalToggle?: (useGlobal: boolean) => void
}

export function PageTypographyControls({
  settings,
  onChange,
  useGlobalDefaults = false,
  onUseGlobalToggle,
}: PageTypographyControlsProps) {
  const handleChange = (key: keyof TypographySettings, value: string) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-4">
      {onUseGlobalToggle && (
        <div className="flex items-center space-x-2 pb-4 border-b">
          <input
            type="checkbox"
            id="use-global-typography"
            checked={useGlobalDefaults}
            onChange={(e) => onUseGlobalToggle(e.target.checked)}
            className="w-4 h-4 text-accent-orange border-gray-300 rounded focus:ring-accent-orange"
          />
          <label
            htmlFor="use-global-typography"
            className="text-sm font-medium text-gray-700"
          >
            Use global typography settings (uncheck to customize this page)
          </label>
        </div>
      )}

      {!useGlobalDefaults && (
        <>
          {/* Body Font */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Font
            </label>
            <select
              value={settings.bodyFont || "Inter"}
              onChange={(e) => handleChange("bodyFont", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
              <option value="Raleway">Raleway</option>
              <option value="Nunito">Nunito</option>
            </select>
          </div>

          {/* Display Font */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Font (Headings)
            </label>
            <select
              value={settings.displayFont || "Bebas Neue"}
              onChange={(e) => handleChange("displayFont", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            >
              <option value="Bebas Neue">Bebas Neue</option>
              <option value="Oswald">Oswald</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Raleway">Raleway</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Lobster">Lobster</option>
              <option value="Barlow Condensed">Barlow Condensed</option>
              <option value="Anton">Anton</option>
              <option value="Righteous">Righteous</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Base Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Font Size (px)
              </label>
              <input
                type="number"
                min="12"
                max="24"
                value={settings.baseSize || "16"}
                onChange={(e) => handleChange("baseSize", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              />
            </div>

            {/* Base Font Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Font Weight
              </label>
              <select
                value={settings.baseWeight || "400"}
                onChange={(e) => handleChange("baseWeight", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Heading Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Font Weight
              </label>
              <select
                value={settings.headingWeight || "700"}
                onChange={(e) => handleChange("headingWeight", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              >
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra-bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Line Height
              </label>
              <input
                type="number"
                min="1"
                max="2"
                step="0.1"
                value={settings.lineHeight || "1.5"}
                onChange={(e) => handleChange("lineHeight", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              />
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Letter Spacing (px)
            </label>
            <input
              type="number"
              min="-2"
              max="5"
              step="0.1"
              value={settings.letterSpacing || "0"}
              onChange={(e) => handleChange("letterSpacing", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Negative values tighten spacing, positive values increase it
            </p>
          </div>
        </>
      )}
    </div>
  )
}
