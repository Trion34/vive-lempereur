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

/** Read all game log entries via the exposed testing hook in app.ts. */
export async function getGameLog(page: Page): Promise<string> {
  const json = await page.evaluate(() => {
    try { return (window as any).__getGameLog?.() || '[]'; }
    catch { return '[]'; }
  });
  const entries = JSON.parse(json) as string[];
  return entries.join('\n');
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

/**
 * Skip the intro screen and pre-battle camp to reach the battle.
 * Returns the opening narrative text captured from the parchment.
 * After this, the "Begin" button is visible (auto-play not yet started).
 */
export async function skipIntro(page: Page): Promise<{ openingNarrative: string }> {
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

  // Step 4: Opening beat parchment — capture text before clicking
  await page.waitForSelector('#parchment-choices .parchment-choice', { timeout: 10000 });
  const openingNarrative = await page.locator('#parchment-narrative').textContent() || '';
  await page.click('#parchment-choices .parchment-choice');

  // Step 5: Wait for "Begin" button (auto-play hasn't started yet)
  await page.waitForSelector('.begin-btn', { timeout: 10000 });

  return { openingNarrative };
}

/**
 * Click "Begin" to start auto-play Part 1.
 * Waits for auto-play to pause at the first story beat or for battle-over.
 */
export async function startBattle(page: Page): Promise<void> {
  const beginBtn = page.locator('.begin-btn');
  if (await beginBtn.count() > 0 && await beginBtn.isVisible()) {
    await beginBtn.evaluate((el: HTMLElement) => el.click());
  }

  // Wait for auto-play to pause (story beat = phase-charge, or battle-over)
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes('phase-charge') || phaseClass.includes('phase-melee')) break;
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') break;
    await page.waitForTimeout(500);
  }
}

/** Click through a parchment choice and its "Continue" result button if present. */
export async function clickParchmentChoice(page: Page): Promise<string> {
  let text = '';
  const choice = page.locator('#parchment-choices .parchment-choice').first();
  try {
    await choice.waitFor({ state: 'visible', timeout: 5000 });
    text = await page.locator('#parchment-narrative').textContent() || '';
    await choice.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(600);
  } catch { return text; }

  // Check if a result "Continue" button appeared
  const continueBtn = page.locator('#parchment-choices .parchment-choice').first();
  try {
    await continueBtn.waitFor({ state: 'visible', timeout: 3000 });
    const resultText = await page.locator('#parchment-narrative').textContent() || '';
    if (resultText !== text) text += '\n' + resultText;
    await continueBtn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(500);
  } catch { /* no continue button */ }

  return text;
}

/** Force the battle to end with a specific outcome using Dev Tools. */
export async function forceFinishBattle(page: Page, outcome: 'Victory' | 'Defeat' | 'Survived' | 'Rout') {
  await page.keyboard.press('Control+Shift+D');
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
  const deadline = Date.now() + 60000; // 60s to accommodate auto-play delays
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
 * Wait for any clickable game button to appear (action, parchment choice, stance, or begin).
 * Handles the load animation gap between volleys.
 */
async function waitForAnyButton(page: Page, timeout = 15000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    // Don't consider buttons clickable while load animation is playing
    const loadDisplay = await page.locator('#load-animation').evaluate((el: HTMLElement) => el.style.display);
    if (loadDisplay !== 'none' && loadDisplay !== '') {
      await page.waitForTimeout(200);
      continue;
    }

    const beginCount = await page.locator('.begin-btn').count();
    const actionCount = await page.locator('#actions-grid button').count();
    const parchmentCount = await page.locator('.parchment-choice').count();
    const stanceCount = await page.locator('.stance-toggle-btn').count();
    const arenaCount = await page.locator('#arena-actions-grid button.action-btn').count();
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);

    if (beginCount > 0 || actionCount > 0 || parchmentCount > 0 || stanceCount > 0 || arenaCount > 0 || battleOver === 'flex') {
      return;
    }
    await page.waitForTimeout(200);
  }
}

/** Click the first available action button, waiting for it to appear first. */
export async function clickFirstAction(page: Page) {
  await waitForAnyButton(page, 15000);

  // Try begin button
  let btn = page.locator('.begin-btn');
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    return;
  }

  // Try actions grid (gorge targets, manual actions)
  btn = page.locator('#actions-grid button').first();
  if (await btn.count() > 0 && await btn.isVisible()) {
    await btn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(200);
    await waitForLoadComplete(page);
    return;
  }

  // Try parchment choices (story beats)
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
 * Play through Phase 1 (auto-play: volleys 1-4 with story beat pauses).
 * Clicks Begin, handles Wounded Sergeant story beat, waits through V3-V4.
 * Returns all accumulated narrative text from the game log.
 */
export async function playPhase1(page: Page): Promise<string> {
  // Start auto-play if Begin button is visible
  const beginBtn = page.locator('.begin-btn');
  if (await beginBtn.count() > 0 && await beginBtn.isVisible()) {
    await startBattle(page);
  }

  // Check if battle is over
  let over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
  if (over === 'flex') return getGameLog(page);

  // Handle story beat #5 (Wounded Sergeant) — click choice + continue
  await clickParchmentChoice(page);

  // Wait for auto-play V3-V4 → transitions to story beat #6 (Fix Bayonets) or melee
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes('phase-charge') || phaseClass.includes('phase-melee')) break;
    over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (over === 'flex') break;
    await page.waitForTimeout(500);
  }

  return getGameLog(page);
}

/** Play through Phase 2 (story beats → melee). Clicks parchment choices until melee is reached. */
export async function playPhase2(page: Page): Promise<string> {
  let allText = '';

  const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
  if (battleOver === 'flex') return allText;

  // Handle story beat(s) and transitions until we reach melee
  for (let attempt = 0; attempt < 20; attempt++) {
    const phaseClass = await page.locator('#game').getAttribute('class') || '';

    if (phaseClass.includes('phase-melee')) {
      break;
    } else if (phaseClass.includes('phase-charge')) {
      const text = await clickParchmentChoice(page);
      allText += '\n' + text;
    } else if (phaseClass.includes('phase-line')) {
      // Auto-play resume: click Begin/Continue if available
      const btn = page.locator('.begin-btn');
      if (await btn.count() > 0 && await btn.isVisible()) {
        await btn.evaluate((el: HTMLElement) => el.click());
      }
    }

    const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (over === 'flex') break;
    await page.waitForTimeout(500);
  }

  return allText;
}

/** Play N melee rounds using Balanced stance, first attack, Torso. */
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
    // Try waiting for melee phase
    try {
      await page.waitForSelector('#game.phase-melee', { timeout: 10000 });
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

    // Check if we've transitioned to a story beat (between opponents)
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes('phase-charge')) {
      await clickParchmentChoice(page);
      await page.waitForTimeout(500);

      // Wait for melee to resume
      const newPhase = await page.locator('#game').getAttribute('class') || '';
      if (!newPhase.includes('phase-melee')) {
        try { await waitForPhase(page, 'melee'); } catch { break; }
      }
      continue;
    }

    // Step 1: Select action — click first available action button
    try {
      await page.waitForSelector('#arena-actions-grid button.action-btn', { timeout: 5000 });
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
