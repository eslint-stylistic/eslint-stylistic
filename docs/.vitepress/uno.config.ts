import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  safelist: [
    'font-mono',
    'mb0!',
    'no-underline!',
  ],
})
