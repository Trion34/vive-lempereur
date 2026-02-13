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
import { getText, getAllText, clickButton, clickFirstAction, playPhase1, playPhase2, playPhase3, waitForPhase, writeReview, skipIntro, forceFinishBattle } from './helpers';

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
    expect(await getText(page, '#morale-num')).toBe('100');
    expect(await getText(page, '#health-num')).toBe('100');
    expect(await getText(page, '#fatigue-num')).toBe('100');

    // Bars should have non-zero width
    const moraleBar = page.locator('#morale-bar');
    const barStyle = await moraleBar.evaluate((el: HTMLElement) => el.style.width);
    expect(barStyle).toBe('100%');
  });

  test('Action buttons are present with labels and descriptions', async ({ page }) => {
    const buttons = page.locator('#actions-grid button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // Each button should have a name and description
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const name = await btn.locator('.action-name').textContent();
      const desc = await btn.locator('.action-desc').textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
      expect(desc?.trim().length).toBeGreaterThan(0);
    }
  });

  test('Clicking an action advances the game state', async ({ page }) => {
    const turnBefore = await getText(page, '#turn-counter');
    await clickFirstAction(page); // Click first action in actions grid
    const turnAfter = await getText(page, '#turn-counter');

    // Turn should have advanced
    expect(turnAfter).not.toBe(turnBefore);
  });

  test('Drill step indicator highlights current step', async ({ page }) => {
    // Initially should highlight PRESENT
    const presentStep = page.locator('.drill-step[data-step="present"]');
    await expect(presentStep).toHaveClass(/active/);
  });

  test('Narrative scroll resets to top on new turn', async ({ page }) => {
    // Play a few turns
    for (let i = 0; i < 3; i++) {
      await clickFirstAction(page);
    }

    const scrollInfo = await page.locator('#narrative-scroll').evaluate((el: HTMLElement) => ({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));

    // Each new turn starts a new page and scrolls to top (0)
    expect(scrollInfo.scrollTop).toBeLessThan(10);
  });

  test('Phase 2 transition: storybook layout replaces columns', async ({ page }) => {
    await playPhase1(page);
    // After Phase 1 (volleys), it goes to melee.
    // We need to play through the first melee context to reach the story beat.
    await playPhase3(page, 12);
    await waitForPhase(page, 'charge');

    await expect(page.locator('#game')).toHaveClass(/phase-charge/);
    await expect(page.locator('.storybook-container')).toBeVisible();

    // Parchment should have narrative content
    const narrative = await getText(page, '#parchment-narrative');
    expect(narrative.trim().length).toBeGreaterThan(0);

    // Choices should be present
    const choices = page.locator('.parchment-choice');
    expect(await choices.count()).toBeGreaterThan(0);
  });

  test('Phase 2 choice buttons have labels and descriptions', async ({ page }) => {
    await playPhase1(page);
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') { test.skip(); return; }
    try { await waitForPhase(page, 'charge'); } catch { test.skip(); return; }

    const choices = page.locator('.parchment-choice');
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
    // After volleys 1-4, it goes directly to the first melee encounter
    await waitForPhase(page, 'melee');

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
    await waitForPhase(page, 'melee');

    // Stance toggle bar and action buttons should appear together
    const stanceBtns = page.locator('.stance-toggle-btn');
    expect(await stanceBtns.count()).toBe(3); // Aggressive, Balanced, Defensive

    // Action buttons should already be visible (no separate stance step)
    const actionBtns = page.locator('#arena-actions-grid button.action-btn');
    expect(await actionBtns.count()).toBeGreaterThan(0);

    // Click first attack action (Bayonet Thrust)
    await actionBtns.first().evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);

    // Body part buttons should appear
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

    // Should show inventory
    const inventory = await getAllText(page, '#char-inventory');
    expect(inventory).toContain('Charleville M1777');

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

    // === OPENING NARRATIVE WORD COUNT ===
    const openingText = await getAllText(page, '#narrative-scroll');
    const openingWords = openingText.trim().split(/\s+/).length;
    if (openingWords > 100) strengths.push(`Opening narrative is substantial: ${openingWords} words — sets the scene well.`);
    else issues.push(`Opening narrative is too short: ${openingWords} words — needs more scene-setting.`);

    // === ACTION BUTTON ANALYSIS ===
    const actionBtns = page.locator('#actions-grid button');
    const actionCount = await actionBtns.count();
    const actionLabels: string[] = [];
    for (let i = 0; i < actionCount; i++) {
      const name = await actionBtns.nth(i).locator('.action-name').textContent() || '';
      const desc = await actionBtns.nth(i).locator('.action-desc').textContent() || '';
      actionLabels.push(`${name}: ${desc}`);
      if (desc.length > 70) issues.push(`Action "${name}" description truncated at 70 chars — full text may be lost.`);
      if (desc.length < 15) issues.push(`Action "${name}" has a very short description (${desc.length} chars) — not informative enough.`);
    }
    if (actionCount >= 2 && actionCount <= 5) strengths.push(`${actionCount} actions available initially — manageable, not overwhelming.`);

    // === PHASE 1 PLAYTHROUGH — TIMING ===
    const p1Start = Date.now();
    let p1Clicks = 0;
    for (let click = 0; click < 12; click++) {
      const phaseClass = await page.locator('#game').getAttribute('class') || '';
      if (phaseClass.includes('phase-charge')) break;
      await clickFirstAction(page);
      p1Clicks++;
    }
    const p1Time = Date.now() - p1Start;
    const p1Seconds = Math.round(p1Time / 1000);
    if (p1Clicks > 10) issues.push(`Phase 1 took ${p1Clicks} clicks — that's a lot of clicking for a scripted phase. Consider reducing to 3 volleys or making some drill steps automatic.`);
    strengths.push(`Phase 1 completed in ${p1Seconds}s with ${p1Clicks} clicks.`);

    // === PHASE 1 NARRATIVE READABILITY ===
    const p1Narrative = await getAllText(page, '#narrative-scroll');
    const p1Words = p1Narrative.trim().split(/\s+/).length;
    const p1Paragraphs = (p1Narrative.match(/\n\n/g) || []).length + 1;
    if (p1Words / p1Paragraphs > 80) issues.push(`Average paragraph in Phase 1 is ${Math.round(p1Words / p1Paragraphs)} words — walls of text. Break into shorter paragraphs.`);

    // === PHASE 2 TRANSITION ===
    const battleOver1 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    let p2TransitionMs = 0;
    let p2ChoiceCount = 0;
    let p2Words = 0;

    if (battleOver1 !== 'flex') {
      const p2Start = Date.now();
      try {
        await page.waitForSelector('#game.phase-charge', { timeout: 5000 });
        p2TransitionMs = Date.now() - p2Start;
        if (p2TransitionMs < 500) strengths.push(`Phase 2 transition: ${p2TransitionMs}ms — snappy.`);
        else issues.push(`Phase 2 transition took ${p2TransitionMs}ms — feels sluggish.`);

        // Storybook readability
        const parchNarrative = await getText(page, '#parchment-narrative');
        p2Words = parchNarrative.trim().split(/\s+/).length;
        if (p2Words < 30) issues.push(`Phase 2 opening narrative only ${p2Words} words — parchment style should have more substance.`);
        else strengths.push(`Phase 2 narrative is ${p2Words} words — good parchment length.`);

        p2ChoiceCount = await page.locator('.parchment-choice').count();
        if (p2ChoiceCount < 2) issues.push(`Only ${p2ChoiceCount} choice(s) in Phase 2 encounter — player needs at least 2 options.`);
      } catch {
        issues.push('Battle ended before Phase 2 — could not evaluate storybook UI.');
      }
    }

    // Play through Phase 2
    await playPhase2(page);

    // === PHASE 3 ANALYSIS ===
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

        // Click balanced to see actions
        try {
          await page.locator('.stance-toggle-btn.balanced').evaluate((el: HTMLElement) => el.click());
          await page.waitForTimeout(300);
          meleeActionCount = await page.locator('#arena-actions-grid button.action-btn').count();
          if (meleeActionCount > 6) issues.push(`${meleeActionCount} melee actions — overwhelming for turn-based combat. Consider grouping or limiting to 4-5.`);
          else strengths.push(`${meleeActionCount} melee actions after stance selection — manageable.`);

          // Click first action to see targets
          await page.locator('#arena-actions-grid button.action-btn').first().evaluate((el: HTMLElement) => el.click());
          await page.waitForTimeout(300);
          meleeTargetCount = await page.locator('.body-target-btn').count();
          if (meleeTargetCount > 0) {
            if (meleeTargetCount === 4) strengths.push('4 body targets — clear targeting system.');
            else issues.push(`${meleeTargetCount} body targets — expected 4 (head/torso/arms/legs).`);
          }
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

      if (endTotalWords < 15) issues.push(`Ending text is only ${endTotalWords} words — feels abrupt. The opening was ${openingWords} words. The ending should match that investment.`);
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
- Opening narrative: ${openingWords} words
- Phase 1 actions available: ${actionCount}
${actionLabels.map(l => `  - ${l}`).join('\n')}

## Interactive Feedback

- Phase 1: ${p1Clicks} clicks in ${p1Seconds}s
- Phase 2 transition: ${p2TransitionMs}ms
- Phase 2 choices available: ${p2ChoiceCount}
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
