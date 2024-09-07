import migrate from './rules/migrate'
import migrateJs from './rules/migrate-js'
import migrateJsx from './rules/migrate-jsx'
import migrateTs from './rules/migrate-ts'

export default {
  rules: {
    migrate,
    'migrate-ts': migrateTs,
    'migrate-js': migrateJs,
    'migrate-jsx': migrateJsx,
  },
}
