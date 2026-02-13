import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Wait for the load animation to finish (display goes to 'none'). */
async function waitForLoadComplete(page: Page, timeout = 12000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const display = await page.locator('#load-animation').evaluate((el: HTMLElement) => el.style.display);
    if (display === 'none' || display === '') return;
    await page.waitForTimeout(200);
  }
}

/** Click a button by matching its visible text content. Uses evaluate to avoid interception. */
export async function clickButton(page: Page, textMatch: string | RegExp) {
  await waitForLoadComplete(page);
  const btn = page.locator('#actions-grid button', { hasText: textMatch }).first();
  await btn.waitFor({ state: 'visible', timeout: 8000 });
  await btn.evaluate((el: HTMLElement) => el.click());
  await page.waitForTimeout(200);
  await waitForLoadComplete(page);
}

/** Skip the intro screen and pre-battle camp to reach the main battle line phase. */
export async function skipIntro(page: Page) {
  // Step 1: Name
  await page.waitForSelector('#intro-name-input');
  await page.fill('#intro-name-input', 'Test Soldier');
  await page.click('#btn-intro-confirm');

  // Step 2: Stats (Begin)
  await page.waitForSelector('#btn-intro-begin');
  await page.click('#btn-intro-begin');

  // Step 3: Pre-battle camp (Loop until March button is available)
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    const marchBtn = page.locator('#btn-march');
    if (await marchBtn.isVisible()) {
      await marchBtn.click();
      break;
    }

    const eventOverlay = page.locator('#camp-event-overlay');
    if (await eventOverlay.isVisible()) {
      // Handle event choice or NPC selection
      const choice = eventOverlay.locator('.parchment-choice').first();
      if (await choice.isVisible()) {
        await choice.click();
        await page.waitForTimeout(400);
        // If it was an event, it might show a "Continue" button now
        const continueBtn = eventOverlay.locator('#btn-event-continue');
        if (await continueBtn.isVisible()) {
          await continueBtn.click();
          await page.waitForTimeout(400);
        }
      }
    } else {
      // Handle activity
      const activity = page.locator('#camp-activities-grid .camp-activity-btn').first();
      if (await activity.isVisible()) {
        await activity.click();
        await page.waitForTimeout(400);
      }
    }
    await page.waitForTimeout(200);
  }

  // Step 4: Opening beat parchment
  await page.waitForSelector('.parchment-choice', { timeout: 10000 });
  await page.click('.parchment-choice');

  // Final wait for battle UI
  await page.waitForSelector('#narrative-scroll', { timeout: 10000 });
}

/** Force the battle to end with a specific outcome using Dev Tools. */
export async function forceFinishBattle(page: Page, outcome: 'Victory' | 'Defeat' | 'Survived' | 'Rout') {
  await page.click('#btn-devtools');
  await page.click('.dev-tab:has-text("Actions")');
  await page.click(`.dev-action-btn:has-text("${outcome}")`);
  // Overlay might already be visible and blocking the close button
  await page.evaluate(() => {
    const devOverlay = document.getElementById('dev-overlay');
    if (devOverlay) devOverlay.style.display = 'none';
  });
  await page.waitForSelector('#battle-over', { state: 'visible', timeout: 5000 });
}

/** Get all visible text from a CSS selector */
export async function getAllText(page: Page, selector: string): Promise<string> {
  return page.locator(selector).allTextContents().then(arr => arr.join('\n'));
}

/** Get text from a single element */
export async function getText(page: Page, selector: string): Promise<string> {
  return (await page.locator(selector).first().textContent()) || '';
}

/** Wait for the game to be in a specific phase, or stop if the battle ends. */
export async function waitForPhase(page: Page, phase: 'line' | 'charge' | 'melee') {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes(`phase-${phase}`)) return;

    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') {
      console.log(`Battle ended before reaching phase ${phase}`);
      return;
    }
    await page.waitForTimeout(500);
  }
  throw new Error(`Timeout waiting for phase ${phase}`);
}

/**
 * Wait for any clickable game button to appear (action, parchment choice, or stance).
 * Handles the load animation gap between volleys — will not return while animation is playing.
 */
async function waitForAnyButton(page: Page, timeout = 12000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    // Don't consider buttons clickable while load animation is playing
    const loadDisplay = await page.locator('#load-animation').evaluate((el: HTMLElement) => el.style.display);
    if (loadDisplay !== 'none' && loadDisplay !== '') {
      await page.waitForTimeout(200);
      continue;
    }

    const actionCount = await page.locator('#actions-grid button').count();
    const parchmentCount = await page.locator('.parchment-choice').count();
    const stanceCount = await page.locator('.stance-toggle-btn').count();
    const arenaCount = await page.locator('#arena-actions-grid button.action-btn').count();
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);

    if (actionCount > 0 || parchmentCount > 0 || stanceCount > 0 || arenaCount > 0 || battleOver === 'flex') {
      return;
    }
    await page.waitForTimeout(200);
  }
}

/** Click the first available action button, waiting for it to appear first. */
export async function clickFirstAction(page: Page) {
  await waitForAnyButton(page, 12000);

  // Try actions grid (Phase 1) — most common
  let btn = page.locator('#actions-grid button').first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    await waitForLoadComplete(page);
    return;
  }

  // Try parchment choices (Phase 2)
  btn = page.locator('.parchment-choice').first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    return;
  }

  // Try stance buttons (Phase 3 step 1)
  btn = page.locator('.stance-toggle-btn').first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    return;
  }

  // Try arena actions (Phase 3 step 2)
  btn = page.locator('#arena-actions-grid button.action-btn').first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    return;
  }
}

/**
 * Play through Phase 1 (4 scripted volleys).
 * Each volley = PRESENT + FIRE + ENDURE, then auto-load animation before next volley.
 * Returns all accumulated narrative text.
 */
export async function playPhase1(page: Page): Promise<string> {
  // 4 volleys × 3 drill steps = 12 action clicks
  for (let click = 0; click < 12; click++) {
    // Check if we've already transitioned out of line phase
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes('phase-melee') || phaseClass.includes('phase-charge')) {
      console.log(`Phase 1 ended early at click ${click} (phase: ${phaseClass})`);
      break;
    }

    await clickFirstAction(page);
  }

  // Wait a moment for transitions
  await page.waitForTimeout(500);
  return getAllText(page, '#narrative-scroll');
}

/** Play through Phase 2 (Story Beats / Charge Encounters). Clicks first available choice. */
export async function playPhase2(page: Page): Promise<string> {
  let allText = '';

  // Check if battle is already over
  const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
  if (battleOver === 'flex') return allText;

  // Loop to handle potential melee -> story beat -> melee cycles
  for (let attempt = 0; attempt < 20; attempt++) {
    const phaseClass = await page.locator('#game').getAttribute('class') || '';

    if (phaseClass.includes('phase-melee')) {
      await playPhase3(page, 1); // Play one round
    } else if (phaseClass.includes('phase-charge')) {
      // Handle story beat choice
      const choice = page.locator('.parchment-choice').first();
      try {
        await choice.waitFor({ state: 'visible', timeout: 2000 });
        await choice.evaluate((el: HTMLElement) => el.click());
        await page.waitForTimeout(600);
        allText += '\n' + await getAllText(page, '#parchment-narrative');
      } catch {
        // Maybe it's a "Continue" button or it transitioned
      }
    } else if (phaseClass.includes('phase-line')) {
      // If we got back to line phase, we passed the first big transition
      break;
    }

    const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (over === 'flex') break;
    await page.waitForTimeout(100);
  }

  return allText;
}

/** Play N melee rounds using Balanced stance, Bayonet Thrust, Torso. */
export async function playPhase3(page: Page, rounds: number): Promise<{ text: string; outcome: string }> {
  let allText = '';

  // Check if battle is already over
  const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
  if (battleOver === 'flex') {
    const outcome = await getText(page, '#battle-over-title');
    return { text: allText, outcome };
  }

  const phaseCheck = await page.locator('#game').getAttribute('class') || '';
  if (!phaseCheck.includes('phase-melee')) {
    // Try waiting briefly for melee phase
    try {
      await page.waitForSelector('#game.phase-melee', { timeout: 5000 });
    } catch {
      const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      const outcome = over === 'flex' ? await getText(page, '#battle-over-title') : 'ongoing';
      return { text: allText, outcome };
    }
  }

  for (let i = 0; i < rounds; i++) {
    // Check if battle is over
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') break;

    // Stance toggle is persistent (defaults to Balanced) — no need to click it each round

    // Step 1: Select action — click first available action button
    try {
      await page.waitForSelector('#arena-actions-grid button.action-btn', { timeout: 3000 });
      await page.locator('#arena-actions-grid button.action-btn').first().evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);
    } catch {
      break;
    }

    // Step 2: If body part selection appears, click Torso
    const torsoBtn = page.locator('.body-target-btn', { hasText: 'Torso' });
    if (await torsoBtn.count() > 0) {
      await torsoBtn.evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);
    }

    allText += '\n' + await getAllText(page, '#arena-narrative');
  }

  const outcome = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display) === 'flex'
    ? await getText(page, '#battle-over-title')
    : 'ongoing';

  return { text: allText, outcome };
}

/** Full playthrough: Phase 1 → Phase 2 → Phase 3 (up to 15 rounds). Returns all text + outcome. */
export async function playToEnd(page: Page): Promise<{ allText: string; outcome: string }> {
  let allText = '';
  allText += await playPhase1(page);
  allText += await playPhase2(page);
  const melee = await playPhase3(page, 15);
  allText += melee.text;
  return { allText, outcome: melee.outcome };
}

/** Write a review markdown file to tests/reviews/ */
export function writeReview(filename: string, content: string) {
  const reviewDir = path.join(__dirname, 'reviews');
  if (!fs.existsSync(reviewDir)) fs.mkdirSync(reviewDir, { recursive: true });
  fs.writeFileSync(path.join(reviewDir, filename), content, 'utf-8');
}

/** Count occurrences of a term (case-insensitive) in text */
export function countTerm(text: string, term: string): number {
  const regex = new RegExp(term, 'gi');
  return (text.match(regex) || []).length;
}
