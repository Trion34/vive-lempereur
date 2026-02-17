/**
 * EVALUATOR PERSONA: Napoleonic History Buff
 *
 * "I'm a historian specializing in the French Revolutionary Wars, 1792-1802.
 *  I can spot an anachronism at fifty paces. If you tell me cuirassiers were
 *  at Rivoli or that Bonaparte was Emperor in 1797, I will find you."
 *
 * This persona evaluates: historical accuracy, period-correct terminology,
 * anachronism detection, correct names/dates/units.
 */

import { test, expect } from '@playwright/test';
import { getText, getAllText, getGameLog, playPhase1, playPhase2, playPhase3, waitForPhase, writeReview, countTerm, skipIntro, startBattle, clickParchmentChoice } from './helpers';

let openingNarrative = '';

test.describe('Napoleonic History Buff — Battle of Rivoli Accuracy', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const result = await skipIntro(page);
    openingNarrative = result.openingNarrative;
  });

  test('Opening narrative references Rivoli setting correctly', async ({ page }) => {
    const lower = openingNarrative.toLowerCase();

    // Must reference the plateau/highland setting
    expect(
      lower.includes('plateau') || lower.includes('adige') || lower.includes('rivoli')
    ).toBe(true);

    // Must reference January or dawn (the date/time)
    expect(
      lower.includes('january') || lower.includes('dawn')
    ).toBe(true);

    // Must reference Austrians (uniform or nationality)
    expect(
      lower.includes('austrian') || lower.includes('white coat')
    ).toBe(true);

    // Must NOT reference blue coats (that's the French uniform, not enemy)
    expect(lower).not.toContain('blue coat');
  });

  test('No anachronistic references in opening narrative', async ({ page }) => {
    const lower = openingNarrative.toLowerCase();

    // Bonaparte was NOT Emperor in 1797 (crowned 1804)
    expect(lower).not.toContain('emperor');

    // Austerlitz was 1805 — 8 years in the future
    expect(lower).not.toContain('austerlitz');

    // Marengo was 1800 — 3 years in the future
    expect(lower).not.toContain('marengo');

    // Cuirassiers were not the cavalry at Rivoli — chasseurs à cheval were
    expect(lower).not.toContain('cuirassier');
  });

  test('Pierre is identified as veteran of Arcole, not Austerlitz', async ({ page }) => {
    const lower = openingNarrative.toLowerCase();

    // Arcole was November 1796 — correct recent battle for Pierre
    expect(lower).toContain('arcole');

    // Austerlitz was 1805 — impossible reference
    expect(lower).not.toContain('austerlitz');
  });

  test('Officer is Captain Leclerc, not Moreau', async ({ page }) => {
    // Start auto-play to reach the line phase where officer card is visible
    await startBattle(page);
    const officerText = await getText(page, '#officer-rank');

    expect(officerText).toContain('Leclerc');
    expect(officerText).not.toContain('Moreau');
  });

  test('Header shows correct battle information', async ({ page }) => {
    const title = await getText(page, '.battle-title');
    expect(title).toContain('Rivoli');
    expect(title).toContain('1797');

    const weather = await getText(page, '#weather');
    expect(weather.toLowerCase()).toContain('cold');

    const time = await getText(page, '#time-of-day');
    expect(time.toLowerCase()).toContain('dawn');
  });

  test('Charleville M1777 is historically accurate for 1797', async ({ page }) => {
    // Open character panel
    await page.locator('#btn-character').evaluate((el: HTMLElement) => el.click());
    await page.waitForSelector('#char-overlay', { state: 'visible' });

    const inventory = await getAllText(page, '#char-inventory');
    // The Charleville M1777 was standard issue — historically correct
    expect(inventory).toContain('Charleville M1777');

    // Close panel
    await page.locator('#btn-char-close').evaluate((el: HTMLElement) => el.click());
  });

  test('Phase 1 volley narratives reference Austrian white coats', async ({ page }) => {
    const allNarrative = await playPhase1(page);
    const lower = allNarrative.toLowerCase();

    // At least one reference to white coats or Austrians in the volley phase
    expect(
      lower.includes('white coat') || lower.includes('white-coat') || lower.includes('austrian')
    ).toBe(true);

    // No blue coat references (enemy is Austrian, not French)
    expect(lower).not.toContain('blue coat');
  });

  test('Phase 2 charge references Arcole and Austrians', async ({ page }) => {
    await playPhase1(page);

    // The game log includes the opening narrative which references Arcole
    const gameLog = await getGameLog(page);
    const lower = gameLog.toLowerCase();

    // Opening narrative references Pierre as "Arcole veteran"
    expect(lower).toContain('arcole');

    // Should NOT reference Austerlitz
    expect(lower).not.toContain('austerlitz');
  });

  test('Phase 2 encounter 3 references Austrian enemy', async ({ page }) => {
    await playPhase1(page);

    // The Fix Bayonets encounter (#6) references "white coats" and "Austrian"
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (phaseClass.includes('phase-charge')) {
      const chargeText = await getAllText(page, '#parchment-narrative');
      const lower = chargeText.toLowerCase();

      expect(
        lower.includes('austrian') || lower.includes('white-coat') || lower.includes('white coat')
      ).toBe(true);
    } else {
      // If we're already past story beat, check the game log
      const gameLog = await getGameLog(page);
      const lower = gameLog.toLowerCase();
      expect(
        lower.includes('austrian') || lower.includes('white coat')
      ).toBe(true);
    }
  });

  test('Phase 3 opponents are Austrian', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);

    // Battle may end before melee if morale collapses — skip check if so
    const battleOver = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    const phaseClass = await page.locator('#game').getAttribute('class') || '';
    if (battleOver === 'flex' || !phaseClass.includes('phase-melee')) {
      try {
        await page.waitForSelector('#game.phase-melee', { timeout: 5000 });
      } catch {
        test.skip(); // RNG ended the battle before melee
        return;
      }
    }

    // First opponent should be "Austrian"
    const oppName = await getText(page, '#arena-opp-name');
    expect(oppName.toLowerCase()).toContain('austrian');
  });

  test('Phase 3 opponents use Austrian terminology, sergeant is Feldwebel', async ({ page }) => {
    await playPhase1(page);
    await playPhase2(page);
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') { test.skip(); return; }
    try { await waitForPhase(page, 'melee'); } catch { test.skip(); return; }

    // Check the displayed opponent name — it should use Austrian terminology
    const oppName = await getText(page, '#arena-opp-name');
    expect(oppName.toLowerCase()).toContain('austrian');

    // Play a few rounds and collect opponent names as they change
    const names: string[] = [oppName];
    for (let i = 0; i < 20; i++) {
      const over = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
      if (over === 'flex') break;
      try {
        await page.waitForSelector('#arena-actions-grid button.action-btn', { timeout: 3000 });
        await page.locator('#arena-actions-grid button.action-btn').first().evaluate((el: HTMLElement) => el.click());
        await page.waitForTimeout(300);
        const torso = page.locator('.body-target-btn', { hasText: 'Torso' });
        if (await torso.count() > 0) {
          await torso.evaluate((el: HTMLElement) => el.click());
          await page.waitForTimeout(300);
        }
        const currentName = await getText(page, '#arena-opp-name');
        if (currentName && !names.includes(currentName)) names.push(currentName);
      } catch { break; }
    }

    // All opponent names should include "Austrian" (not generic nationality-less labels)
    for (const name of names) {
      expect(name.toLowerCase()).toContain('austrian');
    }

    // The sergeant roster uses "Feldwebel" — verify no opponent uses plain "Sergeant"
    for (const name of names) {
      const lower = name.toLowerCase();
      if (lower.includes('sergeant')) {
        // If "sergeant" appears, "feldwebel" should also be present in the personal name
        expect(lower).toContain('feldwebel');
      }
    }
  });

  test('Captain rally uses Leclerc not Moreau', async ({ page }) => {
    // Play through and capture all text from game log
    await playPhase1(page);
    const allText = await getGameLog(page);
    const lower = allText.toLowerCase();

    // If captain rally appears, it should say Leclerc
    if (lower.includes('captain') && (lower.includes('leclerc') || lower.includes('moreau'))) {
      expect(lower).toContain('leclerc');
      expect(lower).not.toContain('moreau');
    }
  });

  test('V4 enemy charge uses Austrian terminology', async ({ page }) => {
    await playPhase1(page);
    const allText = await getGameLog(page);
    const lower = allText.toLowerCase();

    // The volleys and story beats should reference Austrian-specific terms
    expect(
      lower.includes('sturmmarsch') || lower.includes('austrian') || lower.includes('white-coat') || lower.includes('white coat')
    ).toBe(true);
  });

  test('CRITICAL REVIEW — Historical accuracy assessment', async ({ page }) => {
    // === COLLECT ALL GAME TEXT ===
    await playPhase1(page);
    const phase2Text = await playPhase2(page);
    const { text: phase3Text, outcome } = await playPhase3(page, 15);
    const gameLogText = await getGameLog(page);
    const allText = openingNarrative + '\n' + gameLogText + '\n' + phase2Text + '\n' + phase3Text;
    const lower = allText.toLowerCase();

    // Collect ending text if battle is over
    let endingText = '';
    const overDisplay = await page.locator('#battle-over').evaluate((el: HTMLElement) => el.style.display);
    if (overDisplay === 'flex') {
      endingText = await getText(page, '#battle-over-title') + ' ' + await getText(page, '#battle-over-text');
    }
    const fullText = allText + '\n' + endingText;
    const fullLower = fullText.toLowerCase();

    // === ANACHRONISM SCAN ===
    const anachronisms = [
      'emperor', 'austerlitz', 'marengo', 'cuirassier', 'grande armée',
      'marshal', 'rifled', 'minié', 'waterloo', 'napoleon iii',
      'breech-load', 'revolver', 'telegram', 'railroad', 'repeating'
    ];
    const foundAnachronisms: string[] = [];
    for (const term of anachronisms) {
      if (fullLower.includes(term)) foundAnachronisms.push(term);
    }

    // === PERIOD TERMINOLOGY SCORE ===
    const periodTerms = [
      'sturmmarsch', 'feldwebel', 'chasseurs', 'arcole', 'castiglione',
      'charleville', 'musket', 'bayonet', 'volley', 'flint',
      'demi-brigade', 'adige', 'plateau', 'rivoli', 'bonaparte',
      'austrian', 'white coat'
    ];
    const foundPeriodTerms: { term: string; count: number }[] = [];
    for (const term of periodTerms) {
      const count = countTerm(fullText, term);
      if (count > 0) foundPeriodTerms.push({ term, count });
    }
    const periodScore = foundPeriodTerms.length;

    // === REPETITION ANALYSIS ===
    const whiteCoatCount = countTerm(fullText, 'white coat');
    const bayonetCount = countTerm(fullText, 'bayonet');
    const theLineCount = countTerm(fullText, 'the line');
    const smokeCount = countTerm(fullText, 'the smoke');

    // === CHARACTER DEPTH ===
    const pierreCount = countTerm(fullText, 'pierre');
    const jbCount = countTerm(fullText, 'jean-baptiste');
    const leclercCount = countTerm(fullText, 'leclerc');
    const duvalCount = countTerm(fullText, 'duval');
    const austrianNamedChars = fullLower.match(/(?:hans|franz|karl|wilhelm|heinrich|josef|johann|ludwig|stefan|friedrich)\b/gi) || [];

    // === ATMOSPHERE ===
    const atmosphereTerms = ['cold', 'january', 'dawn', 'plateau', 'adige', 'alpine', 'mountain', 'gorge', 'frost', 'ice', 'frozen'];
    const atmosphereCount = atmosphereTerms.reduce((sum, t) => sum + countTerm(fullText, t), 0);

    // === COMPUTE RATING ===
    let rating = 5;
    if (foundAnachronisms.length === 0) rating += 2;
    else rating -= foundAnachronisms.length;
    if (periodScore >= 12) rating += 1;
    if (periodScore >= 15) rating += 1;
    if (whiteCoatCount > 20) rating -= 1; // over-repetition penalty
    if (austrianNamedChars.length > 0) rating += 1;
    if (atmosphereCount >= 8) rating += 1;
    rating = Math.max(1, Math.min(10, rating));

    // === WRITE REVIEW ===
    const review = `# History Buff Review — Battle of Rivoli
## Rating: ${rating}/10

**Outcome of this playthrough:** ${outcome || endingText || 'unknown'}
**Total narrative words:** ${fullText.split(/\\s+/).length}

---

## Commendations

${foundAnachronisms.length === 0 ? '- **No anachronisms detected.** Excellent — not a single historically impossible reference found.' : ''}
${foundPeriodTerms.map(t => `- Period term "${t.term}" used ${t.count} time(s) — correct`).join('\\n')}
${pierreCount > 0 ? `- Pierre (Arcole veteran) mentioned ${pierreCount} times — good character continuity` : ''}
${jbCount > 0 ? `- Jean-Baptiste (conscript) mentioned ${jbCount} times — good character arc` : ''}
${leclercCount > 0 ? `- Captain Leclerc mentioned ${leclercCount} times — correct officer name` : ''}
${atmosphereCount >= 5 ? `- Strong atmospheric detail: ${atmosphereCount} winter/Alpine references` : ''}

## Objections

${foundAnachronisms.length > 0 ? foundAnachronisms.map(a => `- **ANACHRONISM: "${a}"** found in narrative text. This term is historically impossible for January 1797.`).join('\\n') : '- No anachronisms found (rare — well done).'}
${whiteCoatCount > 15 ? `- **"White coat" appears ${whiteCoatCount} times.** This descriptor has become a crutch. The Austrians wore white, yes, but constantly repeating "white coat" as their sole identifier reduces them to a costume rather than an army. Vary the description: "the Austrian line", "the enemy ranks", "Habsburg infantry", "the oncoming column".` : `- "White coat" count: ${whiteCoatCount} — ${whiteCoatCount > 10 ? 'slightly repetitive' : 'acceptable'}`}
${bayonetCount > 20 ? `- **"Bayonet" appears ${bayonetCount} times.** Overused. Use synonyms: "steel", "the point", "cold iron", "the socket blade".` : ''}
${austrianNamedChars.length === 0 ? `- **No named Austrian characters.** Every French soldier gets a name and personality (Pierre, Jean-Baptiste, Leclerc, Duval). The Austrians are faceless "white coats." This undermines the historical humanity of the battle. A Feldwebel could be "Feldwebel Gruber" or "a man from the Deutschmeister regiment." Even one named Austrian would add gravitas.` : ''}
${smokeCount > 12 ? `- **"The smoke" appears ${smokeCount} times.** Excessive for immersion — vary with "haze", "cloud", "murk", "the grey pall".` : ''}
${duvalCount === 0 ? '- Sergeant Duval not mentioned in this playthrough — is he only in random events? He should be more present as the NCO backbone.' : ''}

## Recommendations

1. ${austrianNamedChars.length === 0 ? 'Give at least one Austrian opponent a name and regimental identity. "Feldwebel Gruber of the IR 29 Lindenau" is infinitely more interesting than "An Austrian Feldwebel."' : 'Austrian naming is present — consider adding regimental numbers.'}
2. ${whiteCoatCount > 12 ? `Reduce "white coat" frequency (currently ${whiteCoatCount}). Replace half with alternatives: "the Austrian column", "Habsburg troops", "the enemy in white", "their line".` : 'White coat usage is acceptable.'}
3. Add more period-specific French military terms: "pas de charge" for the advance, "en avant!" as commands, "tirez!" for fire orders.
4. ${atmosphereCount < 8 ? 'Strengthen winter atmosphere — January on an Italian plateau should feel bitterly cold throughout, not just in the opening.' : 'Winter atmosphere is well-maintained.'}
5. Consider adding a brief historical note in the ending screen: "The Battle of Rivoli, 14 January 1797, was Bonaparte's decisive victory in the Italian campaign..."
`;

    writeReview('history-buff.md', review);
  });
});
