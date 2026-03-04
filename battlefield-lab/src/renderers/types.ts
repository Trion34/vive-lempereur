import type { EngagementState, Order } from '../engagement';
import type { FormationShape } from '@src/components/line/BattlefieldView';
import type { VisualParams } from '../store/labStore';

export type Triple<T> = [T, T, T];

/** What every renderer receives */
export interface RendererProps {
  engagement: EngagementState;
  formations: {
    french: Triple<FormationShape>;
    austrian: Triple<FormationShape>;
  };
  playerFormationIndex: 0 | 1 | 2;
  visualParams?: Partial<VisualParams>;
  onCompanyUpdate?: (side: 'french' | 'austrian', index: number, field: string, value: number) => void;
  onRangeUpdate?: (value: number) => void;
}

/** What every renderer exposes via forwardRef */
export interface RendererHandle {
  playVolley: (direction: 'french' | 'austrian', index?: number) => Promise<void>;
  playCharge: (side: 'french' | 'austrian', index: number) => Promise<void>;
  advanceAustrians: (range: number) => Promise<void>;
  clearSmoke: () => void;
  showOrderLabels: (side: 'french' | 'austrian', orders: [Order, Order, Order]) => void;
  hideOrderLabels: (side?: 'french' | 'austrian') => void;
  hideOrderLabel: (side: 'french' | 'austrian', index: number) => void;
}

/** Editable parameter exposed by a renderer for live tuning */
export interface EditableParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

/** A registered renderer plugin */
export interface RendererPlugin {
  id: string;
  label: string;
  description: string;
  /** Which visual tiers this renderer supports (empty = all) */
  tiers: (1 | 2 | 3)[];
  /** The React component (forwardRef) */
  Component: React.ForwardRefExoticComponent<RendererProps & React.RefAttributes<RendererHandle>>;
  /** Parameters that can be tuned live via VisualParamPanel */
  editableParams: EditableParam[];
}
