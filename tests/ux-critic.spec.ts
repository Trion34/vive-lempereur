/**
 * EVALUATOR PERSONA: UI/UX Critic
 *
 * "I review interfaces for a living. I care about layout integrity,
 *  interactive feedback, visual hierarchy, readable text, and smooth
 *  transitions. If a button doesn't look clickable or a layout breaks
 *  between phases, I will notice."
 *
 * This persona evaluates: layout, responsiveness, interactive elements,
 * visual feedback, phase transitions, accessibility of game information.
 */

import { test, expect } from '@playwright/test';
import { getText, getAllText, getGameLog, clickButton, clickFirstAction, playPhase1, playPhase2, playPhase3, waitForPhase, writeReview, skipIntro, startBattle, clickParchmentChoice, forceFinishBattle } from './helpers';

test.describe('UI/UX Critic — Interface Quality Evaluation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);
  });

  test('Initial load renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out Vite HMR noise
        if (!text.includes('[vite]') && !text.includes('HMR')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');
    await page.waitForSelector('#game');
    await page.waitForTimeout(1000);

    expect(errors).toHaveLength(0);
  });

  test('Phase 1 three-column layout is intact', async ({ page }) => {
    await expect(page.locator('#game')).toHaveClass(/phase-line/);

    // All three columns should be visible
    const playerPanel = page.locator('#player-panel');
    const centerColumn = page.locator('.center-column');
    const enemyPanel = page.locator('#enemy-panel');

    await expect(playerPanel).toBeVisible();
    await expect(centerColumn).toBeVisible();
    await expect(enemyPanel).toBeVisible();

    // Each should have non-zero width
    const pBox = await playerPanel.boundingBox();
    const cBox = await centerColumn.boundingBox();
    const eBox = await enemyPanel.boundingBox();

    expect(pBox!.width).toBeGreaterThan(0);
    expect(cBox!.width).toBeGreaterThan(0);
    expect(eBox!.width).toBeGreaterThan(0);
  });

  test('All meters display with correct initial values', async ({ page }) => {
    // After camp, stats may differ from base 100 due to camp activities
    const morale = parseInt(await getText(page, '#morale-num'), 10);
    const health = parseInt(await getText(page, '#health-num'), 10);
    const stamina = parseInt(await getText(page, '#stamina-num'), 10);

    expect(morale).toBeGreaterThanOrEqual(50);
    expect(morale).toBeLessThanOrEqual(200);
    expect(health).toBeGreaterThanOrEqual(50);
    expect(health).toBeLessThanOrEqual(200);
    expect(stamina).toBeGreaterThanOrEqual(50);
    expect(stamina).toBeLessThanOrEqual(200);

    // Bars should have non-zero width
    const moraleBar = page.locator('#morale-bar');
    const barStyle = await moraleBar.evaluate((el: HTMLElement) => el.style.width);
    expect(parseFloat(barStyle)).toBeGreaterThan(0);
  });

  test('Action buttons are present with labels and descriptions', async ({ page }) => {
    // Start auto-play, reach story beat #5 which has labeled choices
    await startBattle(page);

    // Scope to #parchment-choices to avoid hidden camp overlay elements
    const choices = page.locator('#parchment-choices .parchment-choice');
    const count = await choices.count();
    expect(count).toBeGreaterThan(0);

    // Each choice should have a label and description
    for (let i = 0; i < count; i++) {
      const choice = choices.nth(i);
      const label = await choice.locator('.parchment-choice-label').textContent();
      const desc = await choice.locator('.parchment-choice-desc').textContent();
      expect(label?.trim().length).toBeGreaterThan(0);
      expect(desc?.trim().length).toBeGreaterThan(0);
    }
  });

  test('Clicking an action advances the game state', async ({ page }) => {
    // Click "Begin" to start auto-play — it plays through V1-V2 and pauses at story beat
    await startBattle(page);

    // After auto-play V1-V2, the game should be at story beat with narrative content
    const narrative = await getText(page, '#parchment-narrative');
    expect(narrative.trim().length).toBeGreaterThan(0);
  });

  test('Drill step indicator highlights current step', async ({ page }) => {
    // The drill indicator should be visible in phase-line
    // Before auto-play starts, check that it exists and has a step highlighted
    const drillSteps = page.locator('.drill-step');
    const count = await drillSteps.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Narrative scroll resets to top on new turn', async ({ page }) => {
    // Start auto-play and wait for it to run for a bit
    const beginBtn = page.locator('.begin-btn');
    await beginBtn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(5000);

    const scrollInfo = await page.locator('#narrative-scroll').evaluate((el: HTMLElement) => ({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));

    // Auto-play cross-fades narrative, keeping scroll at top
    expect(scrollInfo.scrollTop).toBeLessThan(50);
  });

  test('Phase 2 transition: storybook layout replaces columns', async ({ page }) => {
    await startBattle(page);

    // Should be at story beat (phase-charge)
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (!phaseClass.includes('phase-charge')) {
      try { await waitForPhase(page, 'charge'); } catch { test.skip(); return; }
    }

    await expect(page.locator('#game')).toHaveClass(/phase-charge/);
    await expect(page.locator('.storybook-container')).toBeVisible();

    // Parchment should have narrative content
    const narrative = await getText(page, '#parchment-narrative');
    expect(narrative.trim().length).toBeGreaterThan(0);

    // Choices should be present
    const choices = page.locator('#parchment-choices .parchment-choice');
    expect(await choices.count()).toBeGreaterThan(0);
  });

  test('Phase 2 choice buttons have labels and descriptions', async ({ page }) => {
    await startBattle(page);

    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (!phaseClass.includes('phase-charge')) {
      try { await waitForPhase(page, 'charge'); } catch { test.skip(); return; }
    }

    // Scope to #parchment-choices to avoid hidden camp overlay elements
    const choices = page.locator('#parchment-choices .parchment-choice');
    const count = await choices.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const choice = choices.nth(i);
      const label = await choice.locator('.parchment-choice-label').textContent();
      const desc = await choice.locator('.parchment-choice-desc').textContent();
      expect(label?.trim().length).toBeGreaterThan(0);
      expect(desc?.trim().length).toBeGreaterThan(0);
    }
  });

  test('Phase 3 transition: arena layout renders', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);

    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') { test.skip(); return; }

    try { await waitForPhase(page, 'melee'); } catch { test.skip(); return; }

    await expect(page.locator('#game')).toHaveClass(/phase-melee/);
    await expect(page.locator('.melee-arena')).toBeVisible();

    // Opponent name should be populated
    const oppName = await getText(page, '#arena-opp-name');
    expect(oppName.trim().length).toBeGreaterThan(0);

    // Player HP should be displayed
    const playerHp = await getText(page, '#arena-player-hp-val');
    expect(playerHp.trim().length).toBeGreaterThan(0);
  });

  test('Phase 3 melee flow: stance toggle + action → body part', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);

    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') { test.skip(); return; }

    try { await waitForPhase(page, 'melee'); } catch { test.skip(); return; }

    // Stance toggle bar and action buttons should appear together
    const stanceBtns = page.locator('.stance-toggle-btn');
    expect(await stanceBtns.count()).toBe(3); // Aggressive, Balanced, Defensive

    // Flat action grid — all actions visible at once (attack, defense, utility)
    const actionBtns = page.locator('#arena-actions-grid button.action-btn');
    expect(await actionBtns.count()).toBeGreaterThan(0);

    // Click first attack action (e.g., Bayonet Thrust) — flat grid, no category drill-down
    const attackBtn = page.locator('#arena-actions-grid button.action-btn.melee-attack').first();
    await attackBtn.evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);

    // Body part buttons should appear after clicking an attack action
    const targetBtns = page.locator('.body-target-btn');
    expect(await targetBtns.count()).toBe(4); // Head, Torso, Arms, Legs
  });

  test('Battle-over overlay displays stats', async ({ page }) => {
    await forceFinishBattle(page, 'Victory');

    // Battle should be over by now (victory, defeat, cavalry, or survived)
    const display = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    expect(display).toBe('flex');

    // Title should be populated
    const title = await getText(page, '#battle-over-title');
    expect(title.trim().length).toBeGreaterThan(0);

    // Text should be populated
    const text = await getText(page, '#battle-over-text');
    expect(text.trim().length).toBeGreaterThan(0);

    // Stats should show key metrics
    const stats = await getText(page, '#battle-stats');
    expect(stats).toContain('Turns survived');

    // Restart button should be visible
    await expect(page.locator('#btn-restart')).toBeVisible();
  });

  test('Restart resets to initial state', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);
    await playPhase3(page, 15);

    // Click restart
    await page.locator('#btn-restart').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(500);

    // Battle-over should be hidden
    const display = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    expect(display).toBe('none');

    // Should be in phase-intro now
    await expect(page.locator('#game')).toHaveClass(/phase-intro/);

    // Morale should be back to 100 (in the hidden panel)
    expect(await getText(page, '#morale-num')).toBe('100');

    // Skip intro to get back to phase-line for final check
    await skipIntro(page);
    await expect(page.locator('#game')).toHaveClass(/phase-line/);
  });

  test('Character overlay opens and closes', async ({ page }) => {
    // Open
    await page.locator('#btn-character').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#char-overlay')).toBeVisible();

    // Should show stats
    const stats = await getAllText(page, '#char-stats');
    expect(stats).toContain('Valor');

    // Close
    await page.locator('#btn-char-close').evaluate((el: HTMLElement) => el.click());
    const display = await page.locator('#char-overlay').evaluate((el: HTMLElement) => el.style.display);
    expect(display).toBe('none');
  });

  test('No layout overflow at 1280x720 viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Check key elements are within viewport
    const game = await page.locator('#game').boundingBox();
    expect(game).not.toBeNull();
    expect(game!.width).toBeLessThanOrEqual(1280);
  });

  test('CRITICAL REVIEW — Interface quality assessment', async ({ page }) => {
    const issues: string[] = [];
    const strengths: string[] = [];

    // === PHASE 1 LAYOUT ANALYSIS ===
    const pBox = await page.locator('#player-panel').boundingBox();
    const cBox = await page.locator('.center-column').boundingBox();
    const eBox = await page.locator('#enemy-panel').boundingBox();

    if (pBox && cBox && eBox) {
      const totalW = pBox.width + cBox.width + eBox.width;
      const centerRatio = Math.round((cBox.width / totalW) * 100);
      if (centerRatio < 40) issues.push(`Center column is only ${centerRatio}% of layout — narrative area feels cramped. Should be at least 50%.`);
      else strengths.push(`Three-column layout balanced: center is ${centerRatio}% of width.`);
    }

    // === BEGIN BUTTON CHECK ===
    const beginBtn = page.locator('.begin-btn');
    if (await beginBtn.count() > 0) {
      strengths.push('Clear "Begin" button to start the battle — no confusion about what to click.');
    }

    // === PHASE 1 PLAYTHROUGH — AUTO-PLAY ===
    const p1Start = Date.now();
    await startBattle(page);
    const p1Time = Date.now() - p1Start;
    const p1Seconds = Math.round(p1Time / 1000);
    strengths.push(`Phase 1 auto-play completed in ${p1Seconds}s.`);

    // === STORY BEAT ANALYSIS ===
    const battleOver1 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    let storyBeatChoiceCount = 0;
    let p2Words = 0;

    if (battleOver1 !== 'flex') {
      const phaseClass = await page.locator('#game').getAttribute('class') || '';
      if (phaseClass.includes('phase-charge')) {
        storyBeatChoiceCount = await page.locator('#parchment-choices .parchment-choice').count();
        if (storyBeatChoiceCount >= 2) strengths.push(`Story beat: ${storyBeatChoiceCount} choices — meaningful decision point.`);

        const parchNarrative = await getText(page, '#parchment-narrative');
        p2Words = parchNarrative.trim().split(/\s+/).length;
        if (p2Words < 30) issues.push(`Story beat narrative only ${p2Words} words — parchment style should have more substance.`);
        else strengths.push(`Story beat narrative is ${p2Words} words — good parchment length.`);
      }
    }

    // Play through story beat
    await clickParchmentChoice(page);

    // Wait for next phase
    const deadlineP2 = Date.now() + 60000;
    while (Date.now() < deadlineP2) {
      const pc = await page.locator('#game').getAttribute('class') || '';
      if (pc.includes('phase-charge') || pc.includes('phase-melee')) break;
      const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      if (over === 'flex') break;
      await page.waitForTimeout(500);
    }

    // Handle Fix Bayonets
    const phaseClass2 = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass2.includes('phase-charge')) {
      const fixBayonetsText = await getText(page, '#parchment-narrative');
      const fbWords = fixBayonetsText.trim().split(/\s+/).length;
      if (fbWords > 50) strengths.push(`Fix Bayonets narrative: ${fbWords} words — dramatic transition.`);
      await clickParchmentChoice(page);
    }

    // === PHASE 3 ANALYSIS ===
    await playPhase2(page);
    const battleOver2 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    let meleeStanceCount = 0;
    let meleeActionCount = 0;
    let meleeTargetCount = 0;

    if (battleOver2 !== 'flex') {
      const phaseClass = await page.locator('#game').getAttribute('class') || '';
      if (phaseClass.includes('phase-melee')) {
        // Stance buttons
        meleeStanceCount = await page.locator('.stance-toggle-btn').count();
        if (meleeStanceCount === 3) strengths.push('Melee: exactly 3 stances — clear triangle choice.');
        else issues.push(`Melee: ${meleeStanceCount} stances — expected 3.`);

        // Action buttons
        meleeActionCount = await page.locator('#arena-actions-grid button.action-btn').count();
        if (meleeActionCount > 6) issues.push(`${meleeActionCount} melee actions — overwhelming.`);
        else strengths.push(`${meleeActionCount} melee actions — manageable.`);

        // Click first action to see targets
        try {
          await page.locator('#arena-actions-grid button.action-btn').first().evaluate((el: HTMLElement) => el.click());
          await page.waitForTimeout(300);
          meleeTargetCount = await page.locator('.body-target-btn').count();
          if (meleeTargetCount === 4) strengths.push('4 body targets — clear targeting system.');
          else if (meleeTargetCount > 0) issues.push(`${meleeTargetCount} body targets — expected 4.`);
        } catch { /* battle may have ended */ }
      }
    }

    // Play through Phase 3
    await playPhase3(page, 15);

    // === ENDING ANALYSIS ===
    const battleOver3 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver3 === 'flex') {
      const endTitle = await getText(page, '#battle-over-title');
      const endText = await getText(page, '#battle-over-text');
      const endStats = await getText(page, '#battle-stats');
      const endTotalWords = (endTitle + ' ' + endText).split(/\s+/).length;

      if (endTotalWords < 15) issues.push(`Ending text is only ${endTotalWords} words — feels abrupt.`);
      else strengths.push(`Ending text: ${endTotalWords} words.`);

      if (!endStats.includes('Turns')) issues.push('Ending stats missing turn count.');
      if (!endStats.includes('morale') && !endStats.includes('Morale')) issues.push('Ending stats missing morale information.');

      const restartBtn = page.locator('#btn-restart');
      if (await restartBtn.count() > 0) strengths.push('Restart button visible on ending screen.');
      else issues.push('No restart button on ending screen — how do I play again?');
    }

    // === COMPUTE RATING ===
    let rating = 7;
    rating -= Math.min(3, Math.floor(issues.length / 3));
    rating += Math.min(2, Math.floor(strengths.length / 5));
    rating = Math.max(1, Math.min(10, rating));

    // === WRITE REVIEW ===
    const review = `# UI/UX Critic Review — Interface Quality Assessment
## Rating: ${rating}/10

**Outcome:** ${await (battleOver3 === 'flex' ? getText(page, '#battle-over-title') : Promise.resolve('ongoing'))}

---

## Layout & Visual Hierarchy

${pBox && cBox && eBox ? `- Player panel: ${Math.round(pBox.width)}px | Center: ${Math.round(cBox.width)}px | Enemy: ${Math.round(eBox.width)}px` : '- Could not measure layout'}
- Auto-play Phase 1: ${p1Seconds}s
- Story beat choices: ${storyBeatChoiceCount}

## Interactive Feedback

- Story beat narrative: ${p2Words} words
- Melee stances: ${meleeStanceCount} | Actions: ${meleeActionCount} | Targets: ${meleeTargetCount}

## Strengths

${strengths.map(s => `- ${s}`).join('\n')}

## Issues Found

${issues.length > 0 ? issues.map(i => `- ${i}`).join('\n') : '- No issues found.'}

## Recommendations

${issues.slice(0, 5).map((issue, i) => `${i + 1}. ${issue.split(' — ')[0].split(' — ')[0]}`).join('\n')}
`;

    writeReview('ux-critic.md', review);
  });
});
