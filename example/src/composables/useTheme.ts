import { ref, watch, computed } from "vue"

export type Theme = "light" | "dark"

const STORAGE_KEY = "pev2-theme"
const HIGH_CONTRAST_KEY = "pev2-high-contrast"

function getSystemTheme(): Theme {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark"
  }
  return "light"
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }
  return null
}

function getStoredHighContrast(): boolean {
  return localStorage.getItem(HIGH_CONTRAST_KEY) === "true"
}

function applyTheme(theme: Theme | "high-contrast") {
  // Our custom CSS variables
  document.documentElement.setAttribute("data-theme", theme)
  // Bootstrap 5 dark mode - high-contrast is based on dark
  document.documentElement.setAttribute(
    "data-bs-theme",
    theme === "high-contrast" ? "dark" : theme
  )
}

// Global reactive state
const currentTheme = ref<Theme>(getStoredTheme() || getSystemTheme())
const highContrast = ref<boolean>(getStoredHighContrast())

// Apply initial theme
applyTheme(highContrast.value ? "high-contrast" : currentTheme.value)

// Watch for theme changes (only apply if not in high contrast mode)
watch(currentTheme, (newTheme) => {
  if (!highContrast.value) {
    applyTheme(newTheme)
  }
  localStorage.setItem(STORAGE_KEY, newTheme)
})

// Watch for high contrast changes
watch(highContrast, (enabled) => {
  if (enabled) {
    applyTheme("high-contrast")
  } else {
    // Restore previous theme
    applyTheme(currentTheme.value)
  }
  localStorage.setItem(HIGH_CONTRAST_KEY, String(enabled))
})

// Listen for system theme changes (only if no stored preference)
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!getStoredTheme()) {
        currentTheme.value = e.matches ? "dark" : "light"
      }
    })
}

export function useTheme() {
  function toggleTheme() {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light"
  }

  function setTheme(theme: Theme) {
    currentTheme.value = theme
  }

  function toggleHighContrast() {
    highContrast.value = !highContrast.value
  }

  function setHighContrast(enabled: boolean) {
    highContrast.value = enabled
  }

  // Computed: effective theme being displayed
  const effectiveTheme = computed(() =>
    highContrast.value ? "high-contrast" : currentTheme.value
  )

  return {
    theme: currentTheme,
    highContrast,
    effectiveTheme,
    toggleTheme,
    setTheme,
    toggleHighContrast,
    setHighContrast,
  }
}
