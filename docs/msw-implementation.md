# MSW Integration Guide

This guide demonstrates how MSW (Mock Service Worker) has been integrated into the project and how to use it effectively.

## Overview

MSW provides API mocking capabilities that can be enabled/disabled via environment variables and app configuration. It works seamlessly across:

- **Development** - Browser-based mocking for local development
- **Testing** - Node-based mocking for unit and integration tests
- **Storybook** - Component isolation with mocked APIs

## Quick Start

### 1. Enable MSW

Add to your `.env` file:

```bash
VITE_ENABLE_MSW=true
VITE_MSW_DELAY=500
VITE_MSW_LOGGING=true
```

### 2. Start Development

```bash
pnpm dev
```

MSW will automatically start and you'll see console messages indicating it's active.

### 3. Use Dev Tools (Development Only)

Open browser console and use the global MSW dev tools:

```javascript
// Check MSW status
mswDevTools.getStatus();

// Toggle MSW on/off
mswDevTools.toggle();

// View configuration
mswDevTools.logConfig();
```

## Configuration Options

| Environment Variable | Description            | Default                      |
| -------------------- | ---------------------- | ---------------------------- |
| `VITE_ENABLE_MSW`    | Enable/disable MSW     | `false`                      |
| `VITE_MSW_DELAY`     | Response delay in ms   | `500` (dev), `0` (test)      |
| `VITE_MSW_LOGGING`   | Enable request logging | `true` (dev), `false` (prod) |
| `VITE_API_BASE_URL`  | API base URL for mocks | `/api`                       |

## Available Mock APIs

### Authentication

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

**Example Login:**

```javascript
// Use these credentials in development:
// admin@example.com / password -> Admin user
// user@example.com / password -> Regular user
```

### Users Management

- `GET /api/users` - List users (supports pagination, search, filtering)
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Example API Call:**

```javascript
// Get users with search and pagination
fetch("/api/users?page=1&limit=10&search=john&role=admin");
```

### Utility Endpoints

- `GET /api/health` - Health check
- `GET /api/version` - API version info
- `GET /api/simulate-error/:status` - Simulate HTTP errors
- `POST /api/upload` - File upload simulation
- `GET /api/search` - Generic search

## Development Workflow

### 1. Component Development

When building components that consume APIs:

```typescript
// Your component automatically gets mocked data
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then(res => res.data),
  });

  // Component works with real API structure thanks to MSW
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return <div>{data.name}</div>;
}
```

### 2. Testing Components

```typescript
// Tests automatically use MSW - no additional setup needed
test('displays user name', async () => {
  render(<UserProfile userId="1" />);

  // MSW provides consistent mock data
  await waitFor(() => {
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });
});

// Override mocks for specific test cases
test('handles user not found', async () => {
  addMockHandlers(
    http.get('/api/users/999', () => {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    })
  );

  render(<UserProfile userId="999" />);

  await waitFor(() => {
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});
```

### 3. Storybook Stories

```typescript
// Stories get MSW automatically via addon
export const Default: Story = {
  args: { userId: "1" },
  // Uses default MSW handlers
};

// Override for specific story scenarios
export const LoadingState: Story = {
  args: { userId: "1" },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/users/1", async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ name: "User" });
        }),
      ],
    },
  },
};
```

## Advanced Usage

### Custom Mock Handlers

Create feature-specific handlers:

```typescript
// src/features/products/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { createMockResponse } from "@/shared/lib/msw";

export const productHandlers = [
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const products = mockProducts.filter(
      (p) => !category || p.category === category
    );

    return createMockResponse({ data: products });
  }),
];
```

Add to main handlers:

```typescript
// src/shared/lib/msw/handlers/index.ts
import { productHandlers } from "@/features/products/mocks/handlers";

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...productHandlers, // Add feature handlers
  ...commonHandlers,
];
```

### Runtime Handler Management

```typescript
import { addMockHandlers } from "@/shared/lib/msw";

// Add handlers at runtime (useful for feature flags)
if (featureFlags.newProductAPI) {
  addMockHandlers(...newProductHandlers);
}
```

### Network Condition Simulation

```typescript
import { simulateNetworkCondition } from "@/shared/lib/msw/utils";

// Test with different network conditions
const delay = simulateNetworkCondition("slow"); // 2000ms
const delay = simulateNetworkCondition("fast"); // 50ms
```

## Error Handling

MSW responses follow RFC 9457 Problem Details format:

```json
{
  "type": "https://example.com/problems/user-not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "User with ID 123 was not found",
  "instance": "/api/users/123",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

This ensures consistent error handling across your application.

## Performance Considerations

### Development

- Default 500ms delay simulates realistic API response times
- Helps identify loading state issues early
- Can be adjusted via `VITE_MSW_DELAY`

### Testing

- No delay by default for fast test execution
- Override delays for specific loading state tests
- MSW adds minimal overhead to test runs

### Production

- MSW is automatically disabled in production builds
- No performance impact on production applications
- Service worker file should not be deployed to production

## Troubleshooting

### Common Issues

**MSW not starting:**

```bash
# Check environment variable
echo $VITE_ENABLE_MSW

# Verify service worker file exists
ls public/mockServiceWorker.js

# Check browser console for errors
```

**API calls not being intercepted:**

```javascript
// Verify handler URL matches exactly
console.log("Request URL:", request.url);
console.log("Handler pattern:", "/api/users");

// Check HTTP method
console.log("Request method:", request.method);
```

**Storybook integration issues:**

```javascript
// Verify addon is loaded
// Check .storybook/main.ts includes 'msw-storybook-addon'

// Check story parameters
parameters: {
  msw: {
    handlers: [...] // Must be array
  }
}
```

### Debug Mode

Enable verbose logging:

```bash
VITE_MSW_LOGGING=true
```

This will log all intercepted requests and responses to the console.

## Migration from Other Mocking Solutions

### From fetch mocks:

```typescript
// Before: Manual fetch mocking
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: "test" }),
  })
);

// After: MSW handlers
addMockHandlers(
  http.get("/api/data", () => {
    return HttpResponse.json({ data: "test" });
  })
);
```

### From axios mocks:

```typescript
// Before: Axios mock adapter
import MockAdapter from "axios-mock-adapter";
const mock = new MockAdapter(axios);
mock.onGet("/api/users").reply(200, { users: [] });

// After: MSW handlers (works with any HTTP client)
addMockHandlers(
  http.get("/api/users", () => {
    return HttpResponse.json({ users: [] });
  })
);
```

## Best Practices

1. **Keep mocks realistic** - Use data that matches your actual API
2. **Test error scenarios** - Don't just mock happy paths
3. **Use consistent delays** - Simulate real network conditions
4. **Organize by feature** - Group related handlers together
5. **Document mock APIs** - Help team members understand available endpoints
6. **Version mock data** - Keep mocks in sync with API changes

## Resources

- [MSW Documentation](https://mswjs.io/)
- [Project MSW Setup](../src/shared/lib/msw/README.md)
- [Example Component](../src/shared/ui/user-list/UserList.tsx)
- [Example Tests](../src/shared/ui/user-list/UserList.test.tsx)
- [Example Stories](../src/shared/ui/user-list/UserList.stories.tsx)
