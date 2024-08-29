import type { Linter } from 'eslint'
import type { StylisticCustomizeOptions } from './options'

export declare function customize(options: StylisticCustomizeOptions<false>): Linter.BaseConfig
export declare function customize(options?: StylisticCustomizeOptions<true>): Linter.Config

export declare const configs: {
  /**
   * Disable all legacy rules from `eslint`, `@typescript-eslint` and `eslint-plugin-react`
   *
   * This config works for both flat and legacy config format
   */
  'disable-legacy': Linter.Config
  /**
   * A factory function to customize the recommended config
   */
  'customize': typeof customize
  /**
   * The default recommended config in Flat Config Format
   */
  'recommended-flat': Linter.Config
  /**
   * The default recommended config in Legacy Config Format
   */
  'recommended-extends': Linter.BaseConfig
  /**
   * Enable all rules, in Flat Config Format
   */
  'all-flat': Linter.Config
  /**
   * Enable all rules, in Legacy Config Format
   */
  'all-extends': Linter.BaseConfig
  /**
   * @deprecated Use `recommended-extends` instead
   */
  'recommended-legacy': Linter.BaseConfig
}

export type Configs = typeof configs
