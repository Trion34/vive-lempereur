import React, { Suspense, lazy, useEffect, useRef, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { useLabStore } from './stores/labStore';
import { LabBrowseLayout } from './LabBrowseLayout';
import { LabToolLayout } from './LabToolLayout';
import { HomePage } from './pages/HomePage';
import type { LabPageId } from './labRoutes';

// ============================================================
// ERROR BOUNDARY — catches lazy-load and render failures
// ============================================================

interface ErrorBoundaryState {
  error: Error | null;
}

class LabErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Lab] Render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="si-empty" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Something went wrong</h3>
          <p style={{ color: 'var(--ink-secondary, #666)', margin: '0.5rem 0' }}>
            {this.state.error.message}
          </p>
          <button
            className="btn-restart"
            onClick={() => {
              this.setState({ error: null });
              useLabStore.getState().navigateToLab('home');
            }}
          >
            Return to Lab Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LineBattleLabPage = lazy(async () => {
  const module = await import('./pages/LineBattleLabPage');
  return { default: module.LineBattleLabPage };
});

const MeleeLabPage = lazy(async () => {
  const module = await import('./pages/MeleeLabPage');
  return { default: module.MeleeLabPage };
});

const StoryBeatPreviewPage = lazy(async () => {
  const module = await import('./pages/StoryBeatPreviewPage');
  return { default: module.StoryBeatPreviewPage };
});

const NpcBrowserPage = lazy(async () => {
  const module = await import('./pages/NpcBrowserPage');
  return { default: module.NpcBrowserPage };
});

const CampaignViewerPage = lazy(async () => {
  const module = await import('./pages/CampaignViewerPage');
  return { default: module.CampaignViewerPage };
});

const VisualNovelLabPage = lazy(async () => {
  const module = await import('./pages/VisualNovelLabPage');
  return { default: module.VisualNovelLabPage };
});

const CampLabPage = lazy(async () => {
  const module = await import('./pages/CampLabPage');
  return { default: module.CampLabPage };
});

const MinigameLabPage = lazy(async () => {
  const module = await import('./pages/MinigameLabPage');
  return { default: module.MinigameLabPage };
});

const AudioLabPage = lazy(async () => {
  const module = await import('./pages/AudioLabPage');
  return { default: module.AudioLabPage };
});

const ArtLabPage = lazy(async () => {
  const module = await import('./pages/ArtLabPage');
  return { default: module.ArtLabPage };
});

const AssetStudioPage = lazy(async () => {
  const module = await import('./pages/AssetStudioPage');
  return { default: module.AssetStudioPage };
});

const StateInspectorPage = lazy(async () => {
  const module = await import('./pages/StateInspectorPage');
  return { default: module.StateInspectorPage };
});

const SaveManagerPage = lazy(async () => {
  const module = await import('./pages/SaveManagerPage');
  return { default: module.SaveManagerPage };
});

const labPages: Record<Exclude<LabPageId, 'home'>, React.ComponentType> = {
  'line-battle': LineBattleLabPage,
  'melee': MeleeLabPage,
  'story-beat': StoryBeatPreviewPage,
  'npc-browser': NpcBrowserPage,
  campaign: CampaignViewerPage,
  'visual-novel': VisualNovelLabPage,
  camp: CampLabPage,
  minigame: MinigameLabPage,
  audio: AudioLabPage,
  art: ArtLabPage,
  'asset-studio': AssetStudioPage,
  'state-inspector': StateInspectorPage,
  'save-manager': SaveManagerPage,
};

const VALID_PAGE_IDS = new Set<string>(Object.keys(labPages));

function ToolPageFallback() {
  return (
    <div className="si-empty" style={{ padding: '2rem' }}>
      Loading lab tool...
    </div>
  );
}

function parseLabHash(): { page: LabPageId; config: Record<string, string> } | null {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#page=')) return null;

  const params = new URLSearchParams(hash.slice(1));
  const page = params.get('page');
  if (!page || !VALID_PAGE_IDS.has(page)) return null;

  const config: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key !== 'page') {
      config[key] = value;
    }
  });

  return { page: page as LabPageId, config };
}

export function LabRoot() {
  const currentPage = useLabStore((s) => s.currentPage);
  const hasProcessedHash = useRef(false);

  useEffect(() => {
    if (hasProcessedHash.current) return;
    hasProcessedHash.current = true;

    const parsed = parseLabHash();
    if (parsed) {
      useLabStore.getState().navigateToLab(parsed.page, parsed.config);
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
      <LabErrorBoundary>
        <Suspense fallback={<ToolPageFallback />}>
          {PageComponent ? <PageComponent /> : null}
        </Suspense>
      </LabErrorBoundary>
    </LabToolLayout>
  );
}
