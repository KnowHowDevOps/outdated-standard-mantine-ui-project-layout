# MSW (Mock Service Worker) Setup

This project includes a comprehensive MSW setup that can be enabled/disabled via environment variables and app configuration. MSW provides API mocking capabilities for development, testing, and Storybook.

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```bash
# Enable/disable MSW mocking
VITE_ENABLE_MSW=true

# Response delay in milliseconds (optional)
VITE_MSW_DELAY=500

# Enable request/response logging (optional)
VITE_MSW_LOGGING=true

# API base URL (used by MSW handlers)
VITE_API_BASE_URL=https://api.example.com
```

### App Configuration

MSW configuration is integrated with the app config system:

```typescript
import { appConfig } from "@/app/config";

// Check if MSW is enabled
console.log(appConfig.msw.enabled); // true/false

// Get MSW settings
console.log(appConfig.msw.delay); // 500
console.log(appConfig.msw.logging); // true
```

## Usage

### Automatic Setup

MSW is automatically initialized when the app starts if `VITE_ENABLE_MSW=true`:

- **Development**: Browser worker is started
- **Testing**: Node server is started
- **Storybook**: Integrated via msw-storybook-addon

### Manual Control

You can also control MSW programmatically:

```typescript
import {
  setupMocks,
  stopMocks,
  resetMocks,
  addMockHandlers,
} from "@/shared/lib/msw";

// Start MSW
await setupMocks();

// Stop MSW
stopMocks();

// Reset all handlers
resetMocks();

// Add runtime handlers
addMockHandlers(
  http.get("/api/custom", () => {
    return HttpResponse.json({ message: "Custom response" });
  })
);
```

## Mock Handlers

### Built-in Handlers

The project includes pre-configured handlers for common API patterns:

#### Authentication (`/api/auth/*`)

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user

#### Users (`/api/users/*`)

- `GET /api/users` - List users (with pagination, search, filtering)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Common (`/api/*`)

- `GET /api/health` - Health check
- `GET /api/version` - API version
- `GET /api/simulate-error/:status` - Error simulation
- `POST /api/upload` - File upload
- `GET /api/search` - Generic search

### Custom Handlers

Create custom handlers in the `handlers` directory:

```typescript
// src/shared/lib/msw/handlers/products.ts
import { http, HttpResponse } from "msw";
import { getMockConfig } from "../config";
import { createMockResponse, createMockError } from "../utils";

const config = getMockConfig();

export const productHandlers = [
  http.get(`${config.baseUrl}/products`, () => {
    return createMockResponse({
      data: [
        { id: "1", name: "Product 1", price: 99.99 },
        { id: "2", name: "Product 2", price: 149.99 },
      ],
    });
  }),
];
```

Then add them to the main handlers file:

```typescript
// src/shared/lib/msw/handlers/index.ts
import { productHandlers } from "./products";

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...commonHandlers,
  ...productHandlers, // Add your custom handlers
];
```

## Testing with MSW

### Setup

MSW is automatically configured for tests in `setupTests.ts`. All tests have access to the mock handlers.

### Writing Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { addMockHandlers } from '@/shared/lib/msw';
import { MyComponent } from './MyComponent';

test('renders data from API', async () => {
  // Add custom mock for this test
  addMockHandlers(
    http.get('/api/data', () => {
      return HttpResponse.json({ message: 'Test data' });
    })
  );

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Test data')).toBeInTheDocument();
  });
});
```

### Error Testing

```typescript
test('handles API errors', async () => {
  addMockHandlers(
    http.get('/api/data', () => {
      return HttpResponse.json(
        {
          type: 'https://example.com/problems/server-error',
          title: 'Internal Server Error',
          status: 500,
          detail: 'Something went wrong',
        },
        { status: 500 }
      );
    })
  );

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

## Storybook Integration

MSW is integrated with Storybook via the `msw-storybook-addon`. You can override handlers per story:

```typescript
// Component.stories.tsx
export const WithCustomData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/users", () => {
          return HttpResponse.json({
            data: [{ id: "1", name: "Story User" }],
          });
        }),
      ],
    },
  },
};
```

## Utilities

### Response Helpers

```typescript
import { createMockResponse, createMockError } from "@/shared/lib/msw/utils";

// Success response
return createMockResponse({ data: "success" });

// Error response (RFC 9457 format)
return createMockError({
  message: "Not found",
  status: 404,
  code: "NOT_FOUND",
});
```

### Network Simulation

```typescript
import { simulateNetworkCondition } from "@/shared/lib/msw/utils";

// Simulate slow network
const delay = simulateNetworkCondition("slow"); // 2000ms

// Simulate fast network
const delay = simulateNetworkCondition("fast"); // 50ms
```

## Best Practices

### 1. Environment-Specific Configuration

- Enable MSW in development and testing
- Disable MSW in production
- Use different delays for different environments

### 2. Realistic Mock Data

- Use realistic data that matches your API schema
- Include edge cases (empty lists, long text, etc.)
- Test both success and error scenarios

### 3. Handler Organization

- Group handlers by feature/domain
- Keep handlers focused and simple
- Use utility functions for common patterns

### 4. Testing Strategy

- Test components with both success and error responses
- Test loading states with delayed responses
- Test edge cases with empty or invalid data

### 5. Performance

- Use appropriate delays to simulate real network conditions
- Don't make delays too long in tests
- Consider disabling MSW in production builds

## Troubleshooting

### MSW Not Starting

1. Check that `VITE_ENABLE_MSW=true` in your `.env` file
2. Ensure `mockServiceWorker.js` exists in the `public` directory
3. Check browser console for MSW initialization messages

### Handlers Not Working

1. Verify the handler URL matches your API calls
2. Check the HTTP method (GET, POST, etc.)
3. Ensure handlers are exported from the main handlers file

### Storybook Issues

1. Verify `msw-storybook-addon` is in the addons list
2. Check that handlers are properly configured in story parameters
3. Look for MSW initialization errors in Storybook console

### Test Issues

1. Ensure MSW is set up in `setupTests.ts`
2. Use `addMockHandlers` for test-specific mocks
3. Wait for async operations with `waitFor`

## Migration Guide

If you're adding MSW to an existing project:

1. Install dependencies: `pnpm add -D msw msw-storybook-addon`
2. Copy the MSW configuration files
3. Update your app initialization to call `setupMocks()`
4. Add MSW setup to your test configuration
5. Configure Storybook integration
6. Update environment variables

## Resources

- [MSW Documentation](https://mswjs.io/)
- [MSW Storybook Addon](https://github.com/mswjs/msw-storybook-addon)
- [RFC 9457 Problem Details](https://tools.ietf.org/rfc/rfc9457.txt)
