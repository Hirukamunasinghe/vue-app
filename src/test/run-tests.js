#!/usr/bin/env node

/**
 * Test Runner Script
 * 
 * This script provides a convenient way to run different types of tests
 * with various configurations.
 */

import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '../..')

// Test configurations
const testConfigs = {
  unit: {
    description: 'Run unit tests only',
    command: 'npm run test:run -- --reporter=verbose'
  },
  integration: {
    description: 'Run integration tests only',
    command: 'npm run test:run -- --reporter=verbose src/test/integration'
  },
  coverage: {
    description: 'Run tests with coverage report',
    command: 'npm run test:coverage'
  },
  watch: {
    description: 'Run tests in watch mode',
    command: 'npm run test'
  },
  all: {
    description: 'Run all tests',
    command: 'npm run test:run -- --reporter=verbose'
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const testType = args[0] || 'all'

if (!testConfigs[testType]) {
  console.error(`❌ Unknown test type: ${testType}`)
  console.log('\nAvailable test types:')
  Object.keys(testConfigs).forEach(type => {
    console.log(`  ${type}: ${testConfigs[type].description}`)
  })
  process.exit(1)
}

const config = testConfigs[testType]

console.log(`🚀 Running ${testType} tests...`)
console.log(`📝 ${config.description}`)
console.log(`📍 Project root: ${projectRoot}`)
console.log('')

try {
  // Change to project root directory
  process.chdir(projectRoot)
  
  // Execute the test command
  execSync(config.command, { 
    stdio: 'inherit',
    cwd: projectRoot
  })
  
  console.log(`\n✅ ${testType} tests completed successfully!`)
} catch (error) {
  console.error(`\n❌ ${testType} tests failed!`)
  console.error('Error:', error.message)
  process.exit(1)
} 