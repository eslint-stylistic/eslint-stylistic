import migrate from './rules/migrate'
import migrateJs from './rules/migrate-js'
import migrateJsx from './rules/migrate-jsx'
import migrateTs from './rules/migrate-ts'

const index = {
  rules: {
    migrate,
    'migrate-ts': migrateTs,
    'migrate-js': migrateJs,
    'migrate-jsx': migrateJsx,
  },
}

export {
  index as default,
  index as 'module.exports',
}
