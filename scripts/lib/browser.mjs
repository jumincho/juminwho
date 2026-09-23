import { chromium } from 'playwright'

/**
 * Launches headless Chromium for the scripts in this folder. Set
 * PLAYWRIGHT_CHROMIUM to a browser executable to skip
 * `npx playwright install chromium`, e.g. when a preinstalled build is on disk.
 */
export function launchChromium() {
  return chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined })
}
