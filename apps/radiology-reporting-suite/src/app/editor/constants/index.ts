// eslint-disable-next-line @typescript-eslint/typedef
export const EDITOR_TOOLBAR_ITEM_TYPE = {
  Bold: 'bold',
  Italic: 'italic',
  Underline: 'underline',
  AlignLeft: 'align-left',
  AlignCenter: 'align-center',
  AlignRight: 'align-right',
  BulletedList: 'bulleted-list',
  OrderedList: 'ordered-list',
  FontFamily: 'font-family',
  FontSize: 'font-size',
  Undo: 'undo',
  Redo: 'redo',
  Separator: '|',
} as const;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/typedef
export const EDITOR_DEFAULT_FONT_FAMILY = 'Default' as const;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/typedef
export const EDITOR_DEFAULT_FONT_SIZE = 12 as const;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/typedef
export const EDITOR_DEFAULT_MIN_FONT_SIZE = 6 as const;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/typedef
export const EDITOR_DEFAULT_MAX_FONT_SIZE = 32 as const;
