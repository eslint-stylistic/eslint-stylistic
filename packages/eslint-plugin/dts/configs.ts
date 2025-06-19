import type { Linter } from 'eslint'
import type { StylisticCustomizeOptions } from './options'

export declare function customize(options?: StylisticCustomizeOptions): Linter.Config

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
  'recommended': Linter.Config
  /**
   * The default recommended config in Flat Config Format
   *
   * @deprecated use `recommended` instead.
   */
  'recommended-flat': Linter.Config
  /**
   * Enable all rules, in Flat Config Format
   */
  'all': Linter.Config
  /**
   * Enable all rules, in Flat Config Format
   *
   * @deprecated use `all` instead.
   */
  'all-flat': Linter.Config
}

export type Configs = typeof configs
