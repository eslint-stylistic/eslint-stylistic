import migrate from './rules/migrate'
import migrateTs from './rules/migrate-ts'
import migrateJs from './rules/migrate-js'
import migrateJsx from './rules/migrate-jsx'

export default {
  rules: {
    migrate,
    'migrate-ts': migrateTs,
    'migrate-js': migrateJs,
    'migrate-jsx': migrateJsx,
  },
}
