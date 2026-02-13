/**
 * EVALUATOR PERSONA: Steam Game Reviewer
 *
 * "I've played 2,000 hours of strategy games. I review indie games for fun.
 *  I care about: can I figure out what to do, does the narrative hook me,
 *  are my choices meaningful, is the pacing good, and would I recommend
 *  this to a friend? If I get soft-locked or confused, it's a thumbs down."
 *
 * This persona evaluates: player experience, pacing, clarity of mechanics,
 * narrative engagement, choice meaningfulness, replayability, polish.
 */

import { test, expect } from '@playwright/test';
import { getText, getAllText, clickButton, clickFirstAction, playPhase1, playPhase2, playPhase3, waitForPhase, writeReview, countTerm, skipIntro } from './helpers';

test.describe('Steam Game Reviewer — Player Experience Evaluation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipIntro(page);
  });

  test('"Can I figure out what to do?" — Action buttons have clear descriptions', async ({ page }) => {
    const buttons = page.locator('#actions-grid button');
    const count = await buttons.count();

    // There should be actions available from the start
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const name = await btn.locator('.action-name').textContent();
      const desc = await btn.locator('.action-desc').textContent();

      // No empty or confusing labels
      expect(name?.trim().length).toBeGreaterThan(2);
      expect(desc?.trim().length).toBeGreaterThan(10);
    }
  });

  test('"Does the opening hook me?" — Substantial narrative with named characters', async ({ page }) => {
    const narrative = await getAllText(page, '#narrative-scroll');

    // Should be substantial (not just "Click start")
    const wordCount = narrative.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(80);

    // Should mention named characters to ground the player
    const lower = narrative.toLowerCase();
    expect(
      lower.includes('pierre') || lower.includes('jean-baptiste')
    ).toBe(true);

    // Should set the scene with sensory details
    expect(
      lower.includes('drum') || lower.includes('musket') || lower.includes('bayonet')
    ).toBe(true);
  });

  test('"Is the pacing right?" — Each volley produces new narrative', async ({ page }) => {
    const narrativeBefore = await getAllText(page, '#narrative-scroll');
    const lengthBefore = narrativeBefore.length;

    // Click through one full volley cycle (PRESENT → FIRE → ENDURE)
    await clickFirstAction(page);
    const afterPresent = await getAllText(page, '#narrative-scroll');
    expect(afterPresent.length).toBeGreaterThan(lengthBefore);

    await clickFirstAction(page);
    const afterFire = await getAllText(page, '#narrative-scroll');
    expect(afterFire.length).toBeGreaterThan(afterPresent.length);

    await clickFirstAction(page);
    const afterEndure = await getAllText(page, '#narrative-scroll');
    expect(afterEndure.length).toBeGreaterThan(afterFire.length);
  });

  test('"Do my choices matter?" — Multiple distinct options at key moments', async ({ page }) => {
    // Play to V2 ENDURE (the JB crisis — a key choice moment)
    // V1: PRESENT, FIRE, ENDURE (3 clicks + load animation handled by clickFirstAction)
    for (let step = 0; step < 3; step++) {
      await clickFirstAction(page);
    }
    // V2: PRESENT, FIRE (2 more clicks)
    for (let step = 0; step < 2; step++) {
      await clickFirstAction(page);
    }
    // V2 ENDURE — should have multiple choices (JB crisis offers several options)
    const buttons = page.locator('#actions-grid button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Actions should have different names (not all the same)
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).locator('.action-name').textContent();
      names.push(name || '');
    }
    const unique = new Set(names);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });

  test('"Can I see my stats?" — Meters visible and updating', async ({ page }) => {
    // Check initial visibility
    await expect(page.locator('#morale-num')).toBeVisible();
    await expect(page.locator('#health-num')).toBeVisible();
    await expect(page.locator('#fatigue-num')).toBeVisible();

    // Play through two full volleys (6 clicks) — return fire and scripted events will change stats
    for (let i = 0; i < 6; i++) {
      await clickFirstAction(page);
    }

    // After 2 volleys: morale changes from scripted events, possible health from return fire
    const morale = await getText(page, '#morale-num');
    const health = await getText(page, '#health-num');
    const stamina = await getText(page, '#fatigue-num');

    // At least one stat should have changed from starting 100
    expect(
      morale !== '100' || health !== '100' || stamina !== '100'
    ).toBe(true);
  });

  test('"Does Phase 2 feel different?" — Layout changes for charge phase', async ({ page }) => {
    await playPhase1(page);
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') { test.skip(); return; }
    try { await waitForPhase(page, 'charge'); } catch { test.skip(); return; }

    // Layout should have changed
    await expect(page.locator('#game')).toHaveClass(/phase-charge/);
    await expect(page.locator('.storybook-container')).toBeVisible();

    // Narrative should be longer-form (parchment style)
    const narrative = await getText(page, '#parchment-narrative');
    const wordCount = narrative.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(20);
  });

  test('"Is melee intuitive?" — Clear layout, not overwhelming', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);
    await waitForPhase(page, 'melee');

    // Stance toggle bar should be visible with 3 options
    const stanceBtns = page.locator('.stance-toggle-btn');
    const stanceCount = await stanceBtns.count();
    expect(stanceCount).toBe(3);

    // Action buttons should already be visible alongside stance toggle
    const actionBtns = page.locator('#arena-actions-grid button.action-btn');
    const actionCount = await actionBtns.count();
    expect(actionCount).toBeGreaterThan(0);
    expect(actionCount).toBeLessThanOrEqual(7);

    // Each action should have a clear label
    for (let i = 0; i < actionCount; i++) {
      const name = await actionBtns.nth(i).locator('.action-name').textContent();
      expect(name?.trim().length).toBeGreaterThan(2);
    }
  });

  test('"Is the ending satisfying?" — Battle-over has substance', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);
    await playPhase3(page, 15);

    // Wait for battle-over overlay (cavalry timer or combat result)
    await page.waitForFunction(
      () => document.getElementById('battle-over')?.style.display === 'flex',
      { timeout: 30000 }
    );

    // Title should be meaningful
    const title = await getText(page, '#battle-over-title');
    expect(title.trim().length).toBeGreaterThan(3);

    // Flavor text should have substance (not just "You won")
    const text = await getText(page, '#battle-over-text');
    expect(text.trim().length).toBeGreaterThan(20);

    // Stats should show multiple metrics
    const stats = await getText(page, '#battle-stats');
    expect(stats).toContain('Turns survived');
    expect(stats).toContain('morale');
    expect(stats).toContain('Valor');
  });

  test('"Would I play again?" — Restart works, new run has variation', async ({ page }) => {
    // First playthrough — capture opening
    const firstNarrative = await getAllText(page, '#narrative-scroll');

    // Play to end
    await playPhase1(page);
    await playPhase2(page);
    await playPhase3(page, 15);

    // Wait for battle-over
    await page.waitForFunction(
      () => document.getElementById('battle-over')?.style.display === 'flex',
      { timeout: 30000 }
    );

    // Restart
    await page.locator('#btn-restart').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(500);

    // Should be back to start
    await expect(page.locator('#game')).toHaveClass(/phase-line/);
    const restartNarrative = await getAllText(page, '#narrative-scroll');
    expect(restartNarrative.trim().length).toBeGreaterThan(0);
  });

  test('"No soft-locks?" — Always have available actions during gameplay', async ({ page }) => {
    // Phase 1: verify actions always available
    for (let i = 0; i < 12; i++) { // ~4 volleys * 3 steps
      const btns = page.locator('#actions-grid button');
      const parchment = page.locator('.parchment-choice');
      const stance = page.locator('.stance-toggle-btn');

      const actionCount = await btns.count();
      const parchmentCount = await parchment.count();
      const stanceCount = await stance.count();

      // At least one type of button should be available
      const totalButtons = actionCount + parchmentCount + stanceCount;

      // Check if battle is over
      const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      if (overDisplay === 'flex') break;

      expect(totalButtons).toBeGreaterThan(0);

      // Click whatever is available
      if (actionCount > 0) {
        await btns.first().evaluate((el: HTMLElement) => el.click());
      } else if (parchmentCount > 0) {
        await parchment.first().evaluate((el: HTMLElement) => el.click());
      } else if (stanceCount > 0) {
        await stance.first().evaluate((el: HTMLElement) => el.click());
      }
      await page.waitForTimeout(400);
    }
  });

  test('"Load times acceptable?" — Page loads quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForSelector('#narrative-scroll');
    const loadTime = Date.now() - start;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('"Load times acceptable?" — Phase transitions are snappy', async ({ page }) => {
    await playPhase1(page);

    // Battle may end during Phase 1 due to RNG — skip if so
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') {
      test.skip();
      return;
    }

    const start = Date.now();
    await waitForPhase(page, 'charge');
    const transitionTime = Date.now() - start;

    // Phase transition should be under 1 second
    expect(transitionTime).toBeLessThan(1000);
  });

  test('CRITICAL REVIEW — Player experience assessment', async ({ page }) => {
    const gameStart = Date.now();
    const complaints: string[] = [];
    const praise: string[] = [];

    // === FIRST IMPRESSIONS ===
    const openingText = await getAllText(page, '#narrative-scroll');
    const openingWords = openingText.trim().split(/\s+/).length;
    const uniqueOpeningWords = new Set(openingText.toLowerCase().split(/\s+/));
    const openingUniqueRatio = Math.round((uniqueOpeningWords.size / openingWords) * 100);

    if (openingWords > 100) praise.push(`Opening is ${openingWords} words — draws you in immediately.`);
    else complaints.push(`Opening is only ${openingWords} words. I need more scene-setting before I start clicking.`);

    if (openingText.toLowerCase().includes('pierre') || openingText.toLowerCase().includes('jean-baptiste')) {
      praise.push('Named characters in the opening — I already care about the guys next to me.');
    }

    // === PHASE 1: PACING ===
    const p1Start = Date.now();
    let p1Clicks = 0;
    const narrativeLengths: number[] = [openingText.length];

    for (let click = 0; click < 12; click++) {
      const phaseClass = await page.locator('#game').getAttribute('class') || '';
      if (phaseClass.includes('phase-charge')) break;
      await clickFirstAction(page);
      p1Clicks++;
      const currentText = await getAllText(page, '#narrative-scroll');
      narrativeLengths.push(currentText.length);
    }
    const p1Time = Math.round((Date.now() - p1Start) / 1000);
    const phase1Text = await getAllText(page, '#narrative-scroll');

    // Check narrative grew with each click
    let staleClicks = 0;
    for (let i = 1; i < narrativeLengths.length; i++) {
      if (narrativeLengths[i] <= narrativeLengths[i - 1]) staleClicks++;
    }
    if (staleClicks > 2) complaints.push(`${staleClicks} clicks produced no new narrative — feels like I'm clicking for nothing.`);
    if (p1Clicks >= 12) complaints.push(`Phase 1 took ${p1Clicks} clicks and ${p1Time}s. That's too much clicking before things get interesting. 3 volleys would be enough.`);
    else praise.push(`Phase 1: ${p1Clicks} clicks in ${p1Time}s — well-paced.`);

    // === PHASE 1 STATS ===
    const battleOver1 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    let p1Morale = '?', p1Health = '?', p1Stamina = '?';
    if (battleOver1 !== 'flex') {
      try {
        p1Morale = await getText(page, '#morale-num');
        p1Health = await getText(page, '#health-num');
        p1Stamina = await getText(page, '#fatigue-num');
      } catch { /* phase may have changed */ }
    }

    // === PHASE 2: NARRATIVE SHIFT ===
    const p2Start = Date.now();
    const phase2Text = await playPhase2(page);
    const p2Time = Math.round((Date.now() - p2Start) / 1000);
    const p2Words = phase2Text.trim().split(/\s+/).length;

    if (p2Words > 50) praise.push(`Phase 2 narrative: ${p2Words} words — the parchment style feels different and more literary.`);
    else if (p2Words > 10) complaints.push(`Phase 2 narrative is only ${p2Words} words — I expected longer, more immersive encounter descriptions.`);

    // === PHASE 3: MELEE ===
    const p3Start = Date.now();
    const { text: phase3Text, outcome } = await playPhase3(page, 15);
    const p3Time = Math.round((Date.now() - p3Start) / 1000);
    const totalTime = Math.round((Date.now() - gameStart) / 1000);

    // Check melee text variety
    const meleeLines = phase3Text.split('\n').filter(l => l.trim().length > 10);
    const uniqueMeleeLines = new Set(meleeLines);
    const meleeRepeatPct = meleeLines.length > 0
      ? Math.round(((meleeLines.length - uniqueMeleeLines.size) / meleeLines.length) * 100)
      : 0;

    if (meleeRepeatPct > 40) complaints.push(`${meleeRepeatPct}% of melee combat text is repeated — I'm seeing the same descriptions over and over. Needs more variety.`);
    else if (meleeRepeatPct > 20) complaints.push(`${meleeRepeatPct}% melee text repetition — noticeable after a few rounds.`);
    else if (meleeLines.length > 5) praise.push(`Melee text variety: only ${meleeRepeatPct}% repeated — combat stays fresh.`);

    // === ENDING ===
    let endingWords = 0;
    let endingType = outcome || 'unknown';
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') {
      const endTitle = await getText(page, '#battle-over-title');
      const endText = await getText(page, '#battle-over-text');
      const endStats = await getText(page, '#battle-stats');
      endingType = endTitle;
      endingWords = (endTitle + ' ' + endText).split(/\s+/).length;

      if (endingWords < 20) complaints.push(`Ending is only ${endingWords} words. After ${totalTime}s of gameplay, I deserve a more substantial conclusion. The opening was ${openingWords} words — the ending should match.`);
      else praise.push(`Ending: ${endingWords} words — satisfying conclusion.`);

      if (!endStats.includes('Valor')) complaints.push('Ending stats don\'t show Valor — but I earned it! Show me my accomplishments.');
      if (!endStats.includes('kill') && !endStats.includes('Kill')) complaints.push('Ending stats don\'t mention kills — the most satisfying metric is missing.');
    } else {
      complaints.push('Game didn\'t end after 15 melee rounds — feels like it dragged on too long.');
    }

    // === OVERALL TEXT ANALYSIS ===
    const allText = openingText + phase1Text + phase2Text + phase3Text;
    const totalWords = allText.split(/\s+/).length;
    const fireCount = countTerm(allText, 'FIRE!');
    const whiteCoatCount = countTerm(allText, 'white coat');

    if (fireCount > 8) complaints.push(`"FIRE!" appears ${fireCount} times — the dramatic impact is lost by repetition. Vary it: "GIVE FIRE!", "VOLLEY!", or just describe the sound.`);
    if (whiteCoatCount > 15) complaints.push(`"White coat" appears ${whiteCoatCount} times — I get it, they're Austrian. Find other ways to describe the enemy.`);

    // === VERDICT ===
    const thumbsUp = complaints.length <= 3;
    let rating = 7;
    rating -= Math.min(3, Math.floor(complaints.length / 2));
    rating += Math.min(2, Math.floor(praise.length / 3));
    rating = Math.max(1, Math.min(10, rating));

    const review = `# Steam Reviewer — Player Experience Assessment
## Verdict: ${thumbsUp ? 'THUMBS UP' : 'THUMBS DOWN'} (${rating}/10)

**${thumbsUp ? 'Recommended' : 'Not Recommended'}** | ${Math.round(totalTime / 60)} min playtime | Outcome: ${endingType}

---

## First Impressions
Opening narrative: ${openingWords} words (${openingUniqueRatio}% unique vocabulary).
${openingWords > 100 ? 'The opening hooks you immediately. You feel the cold, you see the men beside you, you know the stakes. This is how you start a game.' : 'The opening needs more substance — I was clicking buttons before I cared about anything.'}

## Pacing
- **Phase 1 (Line):** ${p1Clicks} clicks, ${p1Time}s — ${p1Clicks > 10 ? 'drags. Too many clicks for a scripted tutorial.' : 'well-paced.'}
- **Phase 2 (Charge):** ${p2Time}s — ${p2Words} words of narrative. ${p2Words > 50 ? 'Good shift in tone.' : 'Too brief.'}
- **Phase 3 (Melee):** ${p3Time}s — ${meleeRepeatPct}% text repetition. ${meleeRepeatPct > 30 ? 'Gets tedious.' : 'Stays engaging.'}
- **Total:** ${totalTime}s (${Math.round(totalTime / 60)} min)

## Choice & Agency
- After Phase 1, stats: Morale ${p1Morale}, Health ${p1Health}, Stamina ${p1Stamina}
- ${staleClicks > 0 ? `${staleClicks} actions produced no visible change — felt meaningless` : 'Every action had visible impact — good'}
- Phase 2 narrative: ${p2Words} words of encounter text

## Narrative Quality
- Total words: ${totalWords}
- "FIRE!" count: ${fireCount} ${fireCount > 6 ? '(excessive)' : '(ok)'}
- "White coat" count: ${whiteCoatCount} ${whiteCoatCount > 12 ? '(crutch descriptor)' : '(fine)'}
- Melee text repetition: ${meleeRepeatPct}%

## What I Liked
${praise.map(p => `- ${p}`).join('\n')}

## What Needs Work
${complaints.length > 0 ? complaints.map(c => `- ${c}`).join('\n') : '- Honestly? Nothing major. Well done.'}

## Ending (${endingWords} words)
${endingWords < 20 ? 'The ending is a letdown. I spent several minutes in this world and got a one-line dismissal. The opening created atmosphere — the ending should close the circle with equal weight.' : 'The ending matches the tone of the game. Satisfying conclusion.'}

## Would I Recommend?
${thumbsUp ? 'Yes. Despite some rough edges, the atmosphere and character work carry it. Fix the repetition in melee and bulk up the endings, and this is easily an 8/10.' : 'Not yet. The core is strong — great opening, interesting characters — but the repetitive combat text and thin endings drag it down. Fix those and I\'d flip my vote.'}

## Top 3 Recommendations
${complaints.slice(0, 3).map((c, i) => `${i + 1}. ${c.split(' — ')[0]}`).join('\n')}
`;

    writeReview('steam-reviewer.md', review);
  });
});
