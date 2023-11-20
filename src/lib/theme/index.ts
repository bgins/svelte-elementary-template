import { browser } from '$app/environment'

export type Theme = 'light' | 'dark'

export function loadTheme(): Theme {
  if (browser) {
    return localStorage.getItem('theme') as Theme ?? 'dark'
  }
}

export function storeTheme(theme: Theme): void {
  if (browser) {
    localStorage.setItem('theme', theme)
  }
}

