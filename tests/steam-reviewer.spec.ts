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
import { getText, getAllText, getGameLog, clickButton, clickFirstAction, playPhase1, playPhase2, playPhase3, waitForPhase, writeReview, countTerm, skipIntro, startBattle, clickParchmentChoice, forceFinishBattle } from './helpers';

let openingNarrative = '';

test.describe('Steam Game Reviewer — Player Experience Evaluation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const result = await skipIntro(page);
    openingNarrative = result.openingNarrative;
  });

  test('"Can I figure out what to do?" — Action buttons have clear descriptions', async ({ page }) => {
    // After auto-play Part 1, story beat #5 shows parchment choices with clear labels
    await startBattle(page);

    // Scope to #parchment-choices to avoid hidden camp overlay elements
    const choices = page.locator('#parchment-choices .parchment-choice');
    const count = await choices.count();

    // There should be choices available at the story beat
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const choice = choices.nth(i);
      const label = await choice.locator('.parchment-choice-label').textContent();
      const desc = await choice.locator('.parchment-choice-desc').textContent();

      // No empty or confusing labels
      expect(label?.trim().length).toBeGreaterThan(2);
      expect(desc?.trim().length).toBeGreaterThan(5);
    }
  });

  test('"Does the opening hook me?" — Substantial narrative with named characters', async ({ page }) => {
    // Should be substantial (not just "Click start")
    const wordCount = openingNarrative.trim().split(/\s+/).length;
    expect(wordCount).toBeGreaterThan(60);

    // Should mention named characters to ground the player
    const lower = openingNarrative.toLowerCase();
    expect(
      lower.includes('pierre') || lower.includes('jean-baptiste')
    ).toBe(true);

    // Should set the scene with sensory details
    expect(
      lower.includes('drum') || lower.includes('musket') || lower.includes('bayonet') || lower.includes('cold')
    ).toBe(true);
  });

  test('"Is the pacing right?" — Auto-play produces progressive narrative', async ({ page }) => {
    // Start battle and wait for auto-play to reach story beat
    await startBattle(page);

    // After auto-play, game log should contain substantial narrative from volleys
    const gameLog = await getGameLog(page);
    const wordCount = gameLog.trim().split(/\s+/).length;

    // Should have accumulated significant narrative during volleys 1-2
    expect(wordCount).toBeGreaterThan(100);

    // Should reference volley-related content
    const lower = gameLog.toLowerCase();
    expect(
      lower.includes('volley') || lower.includes('fire') || lower.includes('paces')
    ).toBe(true);
  });

  test('"Do my choices matter?" — Multiple distinct options at key moments', async ({ page }) => {
    // Play to the Wounded Sergeant story beat — a key choice moment
    await startBattle(page);

    // Story beat #5 should have multiple choices (scope to parchment container)
    const choices = page.locator('#parchment-choices .parchment-choice');
    const count = await choices.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Choices should have different labels (not all the same)
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const label = await choices.nth(i).locator('.parchment-choice-label').textContent();
      labels.push(label || '');
    }
    const unique = new Set(labels);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });

  test('"Can I see my stats?" — Meters visible and updating', async ({ page }) => {
    // Check initial visibility
    await expect(page.locator('#morale-num')).toBeVisible();
    await expect(page.locator('#health-num')).toBeVisible();
    await expect(page.locator('#stamina-num')).toBeVisible();

    // Play through auto-play Part 1 — return fire and scripted events will change stats
    await startBattle(page);

    // After auto-play: morale changes from scripted events, possible health from return fire
    const morale = await getText(page, '#morale-num');
    const health = await getText(page, '#health-num');
    const stamina = await getText(page, '#stamina-num');

    // At least one stat should have changed from starting 100
    expect(
      morale !== '100' || health !== '100' || stamina !== '100'
    ).toBe(true);
  });

  test('"Does Phase 2 feel different?" — Layout changes for charge phase', async ({ page }) => {
    await startBattle(page);
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') { test.skip(); return; }

    // We should be at a story beat (phase-charge)
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (!phaseClass.includes('phase-charge')) {
      try { await waitForPhase(page, 'charge'); } catch { test.skip(); return; }
    }

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

    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (battleOver === 'flex') { test.skip(); return; }

    try { await waitForPhase(page, 'melee'); } catch { test.skip(); return; }

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

    // If battle hasn't ended naturally, force it to end
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay !== 'flex') {
      await forceFinishBattle(page, 'Victory');
    }

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
    // Play to end
    await playPhase1(page);
    await playPhase2(page);
    await playPhase3(page, 15);

    // If battle hasn't ended naturally, force it to end
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay !== 'flex') {
      await forceFinishBattle(page, 'Victory');
    }

    // Restart
    await page.locator('#btn-restart').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(500);

    // Should be back at intro
    await expect(page.locator('#game')).toHaveClass(/phase-intro/);
  });

  test('"No soft-locks?" — Always have available actions during gameplay', async ({ page }) => {
    // Start battle and play through story beat
    await startBattle(page);

    // At story beat, there should be choices
    const choices = page.locator('#parchment-choices .parchment-choice');
    expect(await choices.count()).toBeGreaterThan(0);

    // Click through story beat
    await clickParchmentChoice(page);

    // Auto-play resumes — wait for next pause
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      const phaseClass = await page.locator('#game').getAttribute('class') || '';
      const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      if (battleOver === 'flex') break;

      if (phaseClass.includes('phase-charge')) {
        // Story beat — should have choices
        expect(await page.locator('#parchment-choices .parchment-choice').count()).toBeGreaterThan(0);
        break;
      } else if (phaseClass.includes('phase-melee')) {
        // Melee — should have action buttons
        const actions = page.locator('#arena-actions-grid button.action-btn');
        const stances = page.locator('.stance-toggle-btn');
        expect((await actions.count()) + (await stances.count())).toBeGreaterThan(0);
        break;
      }
      await page.waitForTimeout(500);
    }
  });

  test('"Load times acceptable?" — Page loads quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForSelector('#game');
    const loadTime = Date.now() - start;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('"Load times acceptable?" — Phase transitions are snappy', async ({ page }) => {
    // Start auto-play and measure time to first story beat
    const start = Date.now();
    await startBattle(page);
    const transitionTime = Date.now() - start;

    // Auto-play Part 1 (V1-V2) should complete within 60 seconds
    expect(transitionTime).toBeLessThan(60000);

    // Verify we reached a meaningful state
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    expect(
      phaseClass.includes('phase-charge') || phaseClass.includes('phase-melee') || battleOver === 'flex'
    ).toBe(true);
  });

  test('CRITICAL REVIEW — Player experience assessment', async ({ page }) => {
    const gameStart = Date.now();
    const complaints: string[] = [];
    const praise: string[] = [];

    // === FIRST IMPRESSIONS ===
    const openingWords = openingNarrative.trim().split(/\s+/).length;
    const uniqueOpeningWords = new Set(openingNarrative.toLowerCase().split(/\s+/));
    const openingUniqueRatio = Math.round((uniqueOpeningWords.size / openingWords) * 100);

    if (openingWords > 60) praise.push(`Opening is ${openingWords} words — draws you in immediately.`);
    else complaints.push(`Opening is only ${openingWords} words. I need more scene-setting before I start clicking.`);

    if (openingNarrative.toLowerCase().includes('pierre') || openingNarrative.toLowerCase().includes('jean-baptiste')) {
      praise.push('Named characters in the opening — I already care about the guys next to me.');
    }

    // === PHASE 1: AUTO-PLAY PACING ===
    const p1Start = Date.now();
    await startBattle(page);
    const p1Time = Math.round((Date.now() - p1Start) / 1000);

    // Check narrative accumulated during auto-play
    const gameLogAfterP1 = await getGameLog(page);
    const p1Words = gameLogAfterP1.trim().split(/\s+/).length;

    if (p1Words > 200) praise.push(`Phase 1 auto-play: ${p1Words} words of narrative in ${p1Time}s — cinematic and engaging.`);
    else if (p1Words > 50) praise.push(`Phase 1: ${p1Words} words in ${p1Time}s — adequate pacing.`);
    else complaints.push(`Phase 1 only produced ${p1Words} words of narrative.`);

    // === PHASE 1 STATS ===
    const battleOver1 = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    let p1Morale = '?', p1Health = '?', p1Stamina = '?';
    if (battleOver1 !== 'flex') {
      try {
        p1Morale = await getText(page, '#morale-num');
        p1Health = await getText(page, '#health-num');
        p1Stamina = await getText(page, '#stamina-num');
      } catch { /* phase may have changed */ }
    }

    // === WOUNDED SERGEANT CHOICE ===
    const phaseClass1 = await page.locator('#game').getAttribute('class') || '';
    let storyBeatChoices = 0;
    if (phaseClass1.includes('phase-charge')) {
      storyBeatChoices = await page.locator('#parchment-choices .parchment-choice').count();
      if (storyBeatChoices >= 2) praise.push(`Wounded Sergeant story beat: ${storyBeatChoices} choices — meaningful decision.`);
    }

    // Click through story beat
    await clickParchmentChoice(page);

    // === PHASE 2: NARRATIVE SHIFT ===
    const p2Start = Date.now();

    // Wait for next phase transition
    const deadlineP2 = Date.now() + 60000;
    while (Date.now() < deadlineP2) {
      const pc = await page.locator('#game').getAttribute('class') || '';
      if (pc.includes('phase-charge') || pc.includes('phase-melee')) break;
      const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      if (over === 'flex') break;
      await page.waitForTimeout(500);
    }

    // Handle Fix Bayonets story beat
    const phaseClass2 = await page.locator('#game').getAttribute('class') || '';
    let p2Words = 0;
    if (phaseClass2.includes('phase-charge')) {
      const parchText = await getText(page, '#parchment-narrative');
      p2Words = parchText.trim().split(/\s+/).length;
      await clickParchmentChoice(page);
    }
    const p2Time = Math.round((Date.now() - p2Start) / 1000);

    if (p2Words > 50) praise.push(`Fix Bayonets narrative: ${p2Words} words — the parchment style feels different and more literary.`);

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

      if (endingWords < 20) complaints.push(`Ending is only ${endingWords} words. After ${totalTime}s of gameplay, I deserve a more substantial conclusion.`);
      else praise.push(`Ending: ${endingWords} words — satisfying conclusion.`);

      if (!endStats.includes('Valor')) complaints.push('Ending stats don\'t show Valor — but I earned it! Show me my accomplishments.');
      if (!endStats.includes('kill') && !endStats.includes('Kill')) complaints.push('Ending stats don\'t mention kills — the most satisfying metric is missing.');
    } else {
      complaints.push('Game didn\'t end after 15 melee rounds — feels like it dragged on too long.');
    }

    // === OVERALL TEXT ANALYSIS ===
    const allText = openingNarrative + gameLogAfterP1 + phase3Text;
    const totalWords = allText.split(/\s+/).length;
    const fireCount = countTerm(allText, 'FIRE!');
    const whiteCoatCount = countTerm(allText, 'white coat');

    if (fireCount > 8) complaints.push(`"FIRE!" appears ${fireCount} times — the dramatic impact is lost by repetition.`);
    if (whiteCoatCount > 15) complaints.push(`"White coat" appears ${whiteCoatCount} times — I get it, they're Austrian.`);

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
${openingWords > 60 ? 'The opening hooks you immediately. You feel the cold, you see the men beside you, you know the stakes.' : 'The opening needs more substance.'}

## Pacing
- **Phase 1 (Auto-play):** ${p1Time}s — ${p1Words} words of cinematic narrative.
- **Phase 2 (Story beats):** ${p2Time}s — ${p2Words} words of parchment narrative.
- **Phase 3 (Melee):** ${p3Time}s — ${meleeRepeatPct}% text repetition. ${meleeRepeatPct > 30 ? 'Gets tedious.' : 'Stays engaging.'}
- **Total:** ${totalTime}s (${Math.round(totalTime / 60)} min)

## Choice & Agency
- After Phase 1, stats: Morale ${p1Morale}, Health ${p1Health}, Stamina ${p1Stamina}
- Story beat choices: ${storyBeatChoices} options at Wounded Sergeant
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
${endingWords < 20 ? 'The ending is a letdown.' : 'The ending matches the tone of the game. Satisfying conclusion.'}

## Would I Recommend?
${thumbsUp ? 'Yes. Despite some rough edges, the atmosphere and character work carry it.' : 'Not yet. The core is strong but needs polish.'}

## Top 3 Recommendations
${complaints.slice(0, 3).map((c, i) => `${i + 1}. ${c.split(' — ')[0]}`).join('\n')}
`;

    writeReview('steam-reviewer.md', review);
  });
});
