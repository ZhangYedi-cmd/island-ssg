import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

export const unocssOptions: VitePluginConfig = {
    presets: [presetAttributify(), presetWind({}), presetIcons()],
};

