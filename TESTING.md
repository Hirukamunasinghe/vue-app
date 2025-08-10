# Testing Guide

This document provides comprehensive information about testing in this Vue.js application.

## Overview

The application uses the following testing stack:
- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Vue.js testing utilities
- **Testing Library** - Testing utilities for better user-centric tests
- **jsdom** - DOM environment for Node.js testing

## Test Structure

```
src/
├── test/
│   ├── setup.js              # Test environment setup
│   ├── utils.js              # Common test utilities
│   ├── mocks/
│   │   └── axios.js          # Axios mock for API calls
│   └── integration/
│       └── ComponentInteraction.test.js
├── components/
│   ├── __tests__/
│   │   ├── Pagination.test.js
│   │   ├── PostsPopup.test.js
│   │   ├── PostCards.test.js
│   │   └── UserPopup.test.js
│   ├── Pagination.vue
│   ├── PostsPopup.vue
│   ├── PostCards.vue
│   └── UserPopup.vue
└── ...
```

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Using the Test Runner Script

```bash
# Run all tests
node src/test/run-tests.js

# Run only unit tests
node src/test/run-tests.js unit

# Run only integration tests
node src/test/run-tests.js integration

# Run tests with coverage
node src/test/run-tests.js coverage

# Run tests in watch mode
node src/test/run-tests.js watch
```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual components in isolation.

#### Pagination Component Tests
- **File**: `src/components/__tests__/Pagination.test.js`
- **Tests**: 20 test cases
- **Coverage**: Page navigation, button states, accessibility, styling

#### PostsPopup Component Tests
- **File**: `src/components/__tests__/PostsPopup.test.js`
- **Tests**: 25 test cases
- **Coverage**: Rendering, pagination, user interactions, event emissions

#### PostCards Component Tests
- **File**: `src/components/__tests__/PostCards.test.js`
- **Tests**: 25 test cases
- **Coverage**: API calls, state management, user interactions, error handling

#### UserPopup Component Tests
- **File**: `src/components/__tests__/UserPopup.test.js`
- **Tests**: 20 test cases
- **Coverage**: User data display, loading states, event handling

### 2. Integration Tests

Integration tests verify how components work together.

#### Component Interaction Tests
- **File**: `src/test/integration/ComponentInteraction.test.js`
- **Tests**: 8 test cases
- **Coverage**: Component communication, data flow, user workflows

## Test Utilities

### Mock Data

The testing framework provides mock data for consistent testing:

```javascript
import { createMockPosts, createMockUser, createMockProps } from '../test/utils'

// Create mock posts
const mockPosts = createMockPosts(10, 1) // 10 posts for user 1

// Create mock user
const mockUser = createMockUser(1)

// Create mock props
const props = createMockProps({ show: true, userId: 1 })
```

### Axios Mocking

API calls are mocked to avoid external dependencies:

```javascript
import { mockAxios } from '../test/mocks/axios'

// Mock successful response
mockAxios.get.mockResolvedValueOnce({ data: mockPosts })

// Mock error response
mockAxios.get.mockRejectedValueOnce(new Error('API Error'))
```

### Component Mocking

Child components are mocked to focus on the component under test:

```javascript
vi.mock('../ChildComponent.vue', () => ({
  default: {
    name: 'ChildComponent',
    template: '<div data-testid="child">Mocked Component</div>',
    props: ['prop1', 'prop2'],
    emits: ['event1']
  }
}))
```

## Writing New Tests

### 1. Component Test Structure

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import YourComponent from '../YourComponent.vue'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(YourComponent, { props: { /* your props */ } })
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const { emitted } = render(YourComponent, { props: { /* your props */ } })
    
    const button = screen.getByRole('button')
    await fireEvent.click(button)
    
    expect(emitted().eventName).toBeTruthy()
  })
})
```

### 2. Testing Async Operations

```javascript
it('handles async operations', async () => {
  render(YourComponent)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Content')).toBeInTheDocument()
  })
})
```

### 3. Testing Event Emissions

```javascript
it('emits correct events', async () => {
  const { emitted } = render(YourComponent)
  
  const button = screen.getByRole('button')
  await fireEvent.click(button)
  
  expect(emitted().customEvent).toBeTruthy()
  expect(emitted().customEvent[0]).toEqual(['expected', 'data'])
})
```

### 4. Testing Conditional Rendering

```javascript
it('shows content conditionally', () => {
  const { rerender } = render(YourComponent, { props: { show: false } })
  
  expect(screen.queryByText('Content')).not.toBeInTheDocument()
  
  rerender({ show: true })
  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Test both positive and negative scenarios

### 2. Mocking Strategy
- Mock external dependencies (APIs, libraries)
- Mock child components to focus on the component under test
- Use realistic mock data that represents actual usage

### 3. Assertions
- Test what the user sees and interacts with
- Use semantic queries (getByRole, getByLabelText) when possible
- Test both presence and absence of elements

### 4. Async Testing
- Use `waitFor` for asynchronous operations
- Handle loading states and error conditions
- Test user interactions that trigger async operations

## Coverage Goals

The testing framework aims for:
- **Unit Tests**: 90%+ coverage for all components
- **Integration Tests**: Cover all major user workflows
- **Edge Cases**: Test error conditions and boundary cases

## Debugging Tests

### 1. Verbose Output
```bash
npm run test:run -- --reporter=verbose
```

### 2. Debug Mode
```bash
npm run test:run -- --reporter=verbose --no-coverage
```

### 3. Single Test File
```bash
npm run test:run -- src/components/__tests__/YourComponent.test.js
```

### 4. Watch Mode with UI
```bash
npm run test:ui
```

## Common Issues and Solutions

### 1. FontAwesome Icons
Icons are stubbed in tests to avoid rendering issues:
```javascript
global: {
  stubs: {
    'i': { template: '<span class="icon"></span>' }
  }
}
```

### 2. CSS Classes
Test CSS classes using `toHaveClass`:
```javascript
expect(element).toHaveClass('expected-class')
```

### 3. Event Handling
Use `fireEvent` for user interactions:
```javascript
await fireEvent.click(button)
await fireEvent.change(input, { target: { value: 'new value' } })
```

### 4. Async Operations
Use `waitFor` for operations that take time:
```javascript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

## Continuous Integration

Tests should be run automatically in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Contributing to Tests

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing.html) 