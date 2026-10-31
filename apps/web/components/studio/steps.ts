/** Studio step flow: Create → Review → Studio → Export. */
export const STEPS = ['create', 'review', 'studio', 'export'] as const;
export type Step = (typeof STEPS)[number];

export const STEP_META: Record<Step, { index: string; label: string; hint: string }> = {
  create: { index: '01', label: 'Create', hint: 'Source material + purpose' },
  review: { index: '02', label: 'Review', hint: 'Evidence + generation' },
  studio: { index: '03', label: 'Studio', hint: 'Edit slides + design' },
  export: { index: '04', label: 'Export', hint: 'Download .pptx' },
};

export type InspectorTab = 'slide' | 'design' | 'text' | 'proof';

export const INSPECTOR_TABS: Array<{ id: InspectorTab; label: string }> = [
  { id: 'slide', label: 'Slide' },
  { id: 'design', label: 'Design' },
  { id: 'text', label: 'Text' },
  { id: 'proof', label: 'Proof' },
];

export type MobilePane = 'slides' | 'canvas' | 'panel';
