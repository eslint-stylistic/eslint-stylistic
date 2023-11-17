import disableLegacy from './disable-legacy'
import { customize } from './customize'

export type * from './customize'

export const configs = {
  /**
   * Disable all legacy rules from `eslint`, `@typescript-eslint` and `eslint-plugin-react`
   *
   * This config works for both flat and legacy config format
   */
  'disable-legacy': disableLegacy,
  /**
   * A factory function to customize the recommended config
   */
  'customize': customize,
  /**
   * The default recommended config in Flat Config Format
   */
  'recommended-flat': /* #__PURE__ */ customize(),
  /**
   * The default recommended config in Legacy Config Format
   */
  'recommended-legacy': /* #__PURE__ */ customize({ flat: false }),
}
