import React from 'react';
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

export function LabRoot() {
  const currentPage = useLabStore((s) => s.currentPage);

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
