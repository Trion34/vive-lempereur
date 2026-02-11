import { chromium, Page } from 'playwright';

const BASE_URL = 'http://localhost:3002';

async function waitForPhase(page: Page, phase: string, timeout = 10000) {
  await page.waitForSelector(`#game.phase-${phase}`, { timeout });
}

async function getPhase(page: Page): Promise<string> {
  const cls = await page.locator('#game').getAttribute('class') || '';
  const match = cls.match(/phase-(\w+)/);
  return match ? match[1] : 'unknown';
}

async function getMorale(page: Page): Promise<number> {
  const text = await page.locator('#morale-num').textContent();
  return parseInt(text || '0');
}

async function getHealth(page: Page): Promise<number> {
  const text = await page.locator('#health-num').textContent();
  return parseInt(text || '0');
}

async function getDrillStep(page: Page): Promise<string> {
  const active = page.locator('.drill-step.active');
  if (await active.count() === 0) return 'none';
  return await active.getAttribute('data-step') || 'unknown';
}

function log(msg: string) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `playtest-${name}.png` });
  log(`Screenshot: playtest-${name}.png`);
}

// ─── INTRO ─────────────────────────────────────────────────
async function playIntro(page: Page) {
  log('=== INTRO PHASE ===');
  await waitForPhase(page, 'intro');

  await page.fill('#intro-name-input', 'Claude');
  await page.click('#btn-intro-confirm');
  log('Name entered: Claude');
  await page.waitForTimeout(500);

  await page.click('#btn-intro-begin');
  log('Clicked Begin Battle');
  await page.waitForTimeout(1000);
}

// ─── VOLLEY / LINE PHASE ──────────────────────────────────
async function playVolleyPhase(page: Page): Promise<boolean> {
  log('=== LINE / VOLLEY PHASE ===');
  await waitForPhase(page, 'line');

  let volleyCount = 0;

  while (true) {
    const phase = await getPhase(page);
    if (phase !== 'line') {
      log(`Phase changed to: ${phase} (after ${volleyCount} fire volleys)`);
      return true;
    }

    const health = await getHealth(page);
    if (health <= 0) {
      log('DIED during volleys!');
      return false;
    }

    // Wait for reload animation to finish
    const loadSeq = page.locator('.load-sequence');
    if (await loadSeq.count() > 0) {
      log('Reload animation...');
      try {
        await page.waitForSelector('.load-sequence', { state: 'hidden', timeout: 10000 });
      } catch { /* */ }
      await page.waitForTimeout(500);
      continue;
    }

    // Wait for action buttons
    try {
      await page.waitForSelector('#actions-grid .action-btn', { timeout: 5000 });
    } catch {
      await page.waitForTimeout(1000);
      continue;
    }

    const drillStep = await getDrillStep(page);
    const morale = await getMorale(page);
    const actions = page.locator('#actions-grid .action-btn');
    const count = await actions.count();

    if (count === 0) {
      await page.waitForTimeout(500);
      continue;
    }

    // Collect available action names
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await actions.nth(i).locator('.action-name').textContent() || '?');
    }
    log(`[${drillStep}] Morale:${morale} HP:${health} | Actions: ${names.join(', ')}`);

    // Pick action by drill step
    if (drillStep === 'present') {
      const btn = page.locator('.action-btn[data-action="present_arms"]');
      if (await btn.count() > 0) { await btn.click(); log('  → Present Arms'); }
      else { await actions.first().click(); log(`  → ${names[0]}`); }
    } else if (drillStep === 'fire') {
      const btn = page.locator('.action-btn[data-action="fire"]');
      if (await btn.count() > 0) { await btn.click(); log('  → Fire'); volleyCount++; }
      else { await actions.first().click(); log(`  → ${names[0]}`); }
    } else if (drillStep === 'endure') {
      const btn = page.locator('.action-btn[data-action="steady_neighbour"]');
      const btn2 = page.locator('.action-btn[data-action="stand_firm"]');
      if (await btn.count() > 0) { await btn.click(); log('  → Steady Neighbour'); }
      else if (await btn2.count() > 0) { await btn2.click(); log('  → Stand Firm'); }
      else { await actions.first().click(); log(`  → ${names[0]}`); }
    } else {
      // fumble or unknown
      await actions.first().click();
      log(`  → ${names[0]} (${drillStep})`);
    }

    await page.waitForTimeout(800);
  }
}

// ─── MELEE PHASE ──────────────────────────────────────────
async function playMeleePhase(page: Page, label: string): Promise<boolean> {
  log(`=== MELEE PHASE: ${label} ===`);
  await waitForPhase(page, 'melee');

  let exchanges = 0;
  let maxIdles = 0;

  while (true) {
    const phase = await getPhase(page);
    if (phase !== 'melee') {
      log(`Phase ended → ${phase} (after ${exchanges} exchanges)`);
      return true;
    }

    // Check if battle over overlay appeared
    const battleOver = page.locator('#battle-over');
    const boVisible = await battleOver.evaluate(
      (el) => getComputedStyle(el).display !== 'none'
    ).catch(() => false);
    if (boVisible) {
      log('Battle over detected during melee');
      return false;
    }

    const health = await getHealth(page);
    if (health <= 0) {
      log('DIED during melee!');
      return false;
    }

    // Check for body target selection (Step 2 after choosing attack)
    const bodyTargets = page.locator('.body-target-btn');
    if (await bodyTargets.count() > 0) {
      // Pick torso for reliability
      const torso = page.locator('.body-target-btn:has(.body-target-label:text("Torso"))');
      if (await torso.count() > 0) {
        await torso.click();
      } else {
        await bodyTargets.first().click();
      }
      log('  → Target: Torso');
      await page.waitForTimeout(600);
      exchanges++;
      maxIdles = 0;
      continue;
    }

    // Wait for melee action buttons (inside #arena-actions-grid)
    const actionGrid = page.locator('#arena-actions-grid');
    const meleeButtons = actionGrid.locator('.action-btn');
    const btnCount = await meleeButtons.count();

    if (btnCount === 0) {
      await page.waitForTimeout(500);
      maxIdles++;
      if (maxIdles > 20) {
        log('WARNING: No melee actions for 10 seconds, taking screenshot');
        await screenshot(page, 'melee-stuck');
        return false;
      }
      continue;
    }

    maxIdles = 0;

    // Get round/opponent info
    const roundText = await page.locator('#arena-round').textContent().catch(() => '?');
    const oppName = await page.locator('#arena-opp-name').textContent().catch(() => '?');
    const oppHp = await page.locator('#arena-opp-hp-val').textContent().catch(() => '?');
    const morale = await getMorale(page);

    // Collect visible (available) actions
    const availableActions: { name: string; el: any; isAttack: boolean; isDefense: boolean }[] = [];
    for (let i = 0; i < btnCount; i++) {
      const btn = meleeButtons.nth(i);
      const opacity = await btn.evaluate((el: HTMLElement) => getComputedStyle(el).opacity);
      if (parseFloat(opacity) < 0.5) continue; // skip unavailable actions
      const name = await btn.locator('.action-name').textContent() || '?';
      const cls = await btn.getAttribute('class') || '';
      availableActions.push({
        name,
        el: btn,
        isAttack: cls.includes('melee-attack'),
        isDefense: cls.includes('melee-defense'),
      });
    }

    log(`Round:${roundText} vs ${oppName}(HP:${oppHp}) Morale:${morale} | ${availableActions.map(a => a.name).join(', ')}`);

    if (availableActions.length === 0) {
      await page.waitForTimeout(500);
      continue;
    }

    // Strategy: attack first, guard if low morale
    if (morale < 25) {
      const guard = availableActions.find(a => a.name.includes('Guard'));
      if (guard) {
        await guard.el.click();
        log('  → Guard (low morale)');
        await page.waitForTimeout(600);
        exchanges++;
        continue;
      }
    }

    // Default: pick first attack
    const attack = availableActions.find(a => a.isAttack);
    if (attack) {
      await attack.el.click();
      log(`  → ${attack.name}`);
      await page.waitForTimeout(400);
      // body target selection happens next loop iteration
      continue;
    }

    // Fallback: any available action
    await availableActions[0].el.click();
    log(`  → ${availableActions[0].name} (fallback)`);
    await page.waitForTimeout(600);
    exchanges++;
  }
}

// ─── STORY BEAT ───────────────────────────────────────────
async function playStoryBeat(page: Page) {
  log('=== STORY BEAT: THE BATTERY ===');

  await page.waitForSelector('#storybook-container', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);

  // Read narrative
  const narrative = await page.locator('#parchment-narrative').textContent();
  log(`Narrative: ${(narrative || '').substring(0, 300)}...`);

  // List choices
  const choices = page.locator('.parchment-choice');
  const count = await choices.count();
  for (let i = 0; i < count; i++) {
    const label = await choices.nth(i).locator('.parchment-choice-label').textContent();
    const desc = await choices.nth(i).locator('.parchment-choice-desc').textContent();
    log(`  Choice ${i + 1}: ${label} — ${desc}`);
  }

  await screenshot(page, 'storybeat');

  // Choose "Charge the battery" (first choice)
  await choices.first().click();
  log('CHOSE: Charge the Battery!');
  await page.waitForTimeout(1000);
}

// ─── BATTLE OVER ──────────────────────────────────────────
async function checkBattleOver(page: Page): Promise<boolean> {
  log('=== CHECKING BATTLE OVER ===');

  try {
    // Wait for the overlay to show
    await page.waitForFunction(
      () => {
        const el = document.getElementById('battle-over');
        return el && getComputedStyle(el).display !== 'none';
      },
      { timeout: 10000 }
    );
  } catch {
    log('No battle-over screen found');
    return false;
  }

  const title = await page.locator('#battle-over-title').textContent();
  const text = await page.locator('#battle-over-text').textContent();
  log(`OUTCOME: ${title}`);
  log(`Text: ${(text || '').substring(0, 400)}`);

  await screenshot(page, 'battle-over');
  return true;
}

// ─── MAIN ─────────────────────────────────────────────────
async function main() {
  log('╔══════════════════════════════════════════════════════╗');
  log('║  Playwright Playtest — Battle of Rivoli Part 1      ║');
  log('╚══════════════════════════════════════════════════════╝');
  log(`Target: ${BASE_URL}`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 80,
  });

  const page = await (await browser.newContext({
    viewport: { width: 1280, height: 900 },
  })).newPage();

  // Collect console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(BASE_URL);
  log('Page loaded');
  await page.waitForTimeout(1000);

  try {
    // Phase 1: Intro
    await playIntro(page);

    // Phase 2: Volleys (4 volleys → melee transition)
    const survivedVolleys = await playVolleyPhase(page);
    if (!survivedVolleys) {
      await checkBattleOver(page);
      await page.waitForTimeout(3000);
      await browser.close();
      return;
    }

    // Phase 3: First melee — terrain, 10 rounds
    let phase = await getPhase(page);
    log(`After volleys, phase is: ${phase}`);
    if (phase === 'melee') {
      const survived = await playMeleePhase(page, 'TERRAIN (10 rounds)');
      if (!survived) {
        await checkBattleOver(page);
        await page.waitForTimeout(3000);
        await browser.close();
        return;
      }
    }

    // Phase 4: Story beat — battery choice
    phase = await getPhase(page);
    log(`After first melee, phase is: ${phase}`);
    if (phase === 'charge') {
      // phase-charge CSS class is used for StoryBeat
      await playStoryBeat(page);
    } else {
      log(`WARNING: Expected phase-charge, got: ${phase}`);
      await screenshot(page, 'unexpected-phase');
    }

    // Phase 5: Battery melee (8 rounds)
    phase = await getPhase(page);
    log(`After story beat, phase is: ${phase}`);
    if (phase === 'melee') {
      const survived = await playMeleePhase(page, 'BATTERY CHARGE (8 rounds)');
      if (!survived) {
        await checkBattleOver(page);
        await page.waitForTimeout(3000);
        await browser.close();
        return;
      }
    }

    // Phase 6: Part 1 Complete
    await checkBattleOver(page);

    // Report
    log('\n══════════════════════════════════════');
    log('  PLAYTEST COMPLETE');
    log('══════════════════════════════════════');
    if (errors.length > 0) {
      log(`\nConsole errors (${errors.length}):`);
      errors.forEach(e => log(`  ❌ ${e}`));
    } else {
      log('\nNo console errors detected.');
    }

    log('\nBrowser stays open for 15s...');
    await page.waitForTimeout(15000);

  } catch (error) {
    log(`FATAL ERROR: ${error}`);
    await screenshot(page, 'error');
    await page.waitForTimeout(5000);
  }

  await browser.close();
  log('Done.');
}

main().catch(console.error);
