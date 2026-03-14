import React, { useEffect, useRef } from 'react';
import { useLabStore } from './stores/labStore';
import { LabBrowseLayout } from './LabBrowseLayout';
import { LabToolLayout } from './LabToolLayout';
import { HomePage } from './pages/HomePage';
import { LineBattleLabPage } from './pages/LineBattleLabPage';
import { MeleeLabPage } from './pages/MeleeLabPage';
import { StoryBeatPreviewPage } from './pages/StoryBeatPreviewPage';
import { NpcBrowserPage } from './pages/NpcBrowserPage';
import { CampaignViewerPage } from './pages/CampaignViewerPage';
import { VisualNovelLabPage } from './pages/VisualNovelLabPage';
import { CampLabPage } from './pages/CampLabPage';
import { MinigameLabPage } from './pages/MinigameLabPage';
import { AudioLabPage } from './pages/AudioLabPage';
import { ArtLabPage } from './pages/ArtLabPage';
import { StateInspectorPage } from './pages/StateInspectorPage';
import { SaveManagerPage } from './pages/SaveManagerPage';
import type { LabPageId } from './labRoutes';

const labPages: Record<string, React.ComponentType> = {
  'line-battle': LineBattleLabPage,
  'melee': MeleeLabPage,
  'story-beat': StoryBeatPreviewPage,
  'npc-browser': NpcBrowserPage,
  'campaign': CampaignViewerPage,
  'visual-novel': VisualNovelLabPage,
  'camp': CampLabPage,
  'minigame': MinigameLabPage,
  'audio': AudioLabPage,
  'art': ArtLabPage,
  'state-inspector': StateInspectorPage,
  'save-manager': SaveManagerPage,
};

const VALID_PAGE_IDS = new Set<string>(Object.keys(labPages));

/**
 * Parse the URL hash for cross-launch parameters.
 * Format: #page=<pageId>&key1=value1&key2=value2
 */
function parseLabHash(): { page: LabPageId; config: Record<string, string> } | null {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#page=')) return null;

  const params = new URLSearchParams(hash.slice(1)); // remove '#'
  const page = params.get('page');
  if (!page || !VALID_PAGE_IDS.has(page)) return null;

  const config: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key !== 'page') {
      config[key] = decodeURIComponent(value);
    }
  });

  return { page: page as LabPageId, config };
}

export function LabRoot() {
  const currentPage = useLabStore((s) => s.currentPage);
  const hasProcessedHash = useRef(false);

  // On mount, check for hash-based auto-navigation (cross-launch from another tab)
  useEffect(() => {
    if (hasProcessedHash.current) return;
    hasProcessedHash.current = true;

    const parsed = parseLabHash();
    if (parsed) {
      useLabStore.getState().navigateToLab(parsed.page, parsed.config);
      // Clear the hash so refresh doesn't re-navigate
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (currentPage === 'home') {
    return (
      <LabBrowseLayout>
        <HomePage />
      </LabBrowseLayout>
    );
  }

  const PageComponent = labPages[currentPage];
  return (
    <LabToolLayout>
      {PageComponent ? <PageComponent /> : null}
    </LabToolLayout>
  );
}
