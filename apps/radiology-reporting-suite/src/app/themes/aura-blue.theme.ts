import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const THEME_AURA_BLUE: unknown = definePreset(Aura, {
  semantic: {
    primary: palette('{blue}'),
  },
});
