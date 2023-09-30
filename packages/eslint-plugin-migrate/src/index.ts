import migrate from './rules/migrate'
import migrateTs from './rules/migrate-ts'
import migrateJs from './rules/migrate-js'

export default {
  rules: {
    migrate,
    'migrate-ts': migrateTs,
    'migrate-js': migrateJs,
  },
}
