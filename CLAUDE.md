# CLAUDE - Coding and Architecture Guidelines

## Table of Contents
- [Overview](#overview)
- [React Best Practices](#react-best-practices)
- [TanStack Router](#tanstack-router)
- [TanStack Query](#tanstack-query)
- [State Management](#state-management)
- [Component Design](#component-design)
- [TypeScript Usage](#typescript-usage)
- [Performance Optimization](#performance-optimization)
- [Testing Approach](#testing-approach)
- [Styling Guidelines](#styling-guidelines)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Code Reviews](#code-reviews)

## Overview

This document outlines the coding standards and architectural patterns to be followed while developing the Mantine UI application. These guidelines are designed to ensure code quality, maintainability, and consistency across the project.

## React Best Practices

### Functional Components

- Always use functional components with hooks rather than class components.
- Use React 19's new features like automatic batching and concurrent rendering for better performance.
```
tsx
// Good
function UserProfile({ userId }: { userId: string }) {
const [user, setUser] = useState<User | null>(null);
// ...
return <div>{/* Component JSX */}</div>;
}

// Avoid
class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
// ...
}
```
### Custom Hooks

- Extract complex logic into custom hooks for reusability and testability.
- Name custom hooks with the `use` prefix according to React conventions.
```
tsx
// Custom hook example
function useUserData(userId: string) {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
// Fetch user data logic here
}, [userId]);

return { user, loading, error };
}
```
### Component Organization

- Keep components focused on a single responsibility.
- Break down large components into smaller, reusable ones.
- Co-locate related components in the same directory if they're not used elsewhere.

### Props and PropTypes

- Use TypeScript interfaces for props instead of PropTypes.
- Provide meaningful names for props and interfaces.
- Use default props when applicable.
```
tsx
interface UserCardProps {
name: string;
email: string;
role?: string; // Optional prop
onEdit: (id: string) => void;
}

function UserCard({ name, email, role = 'User', onEdit }: UserCardProps) {
// Component implementation
}
```
### Event Handling

- Use callbacks passed as props for component communication.
- Name handler props with the `on` prefix and handler functions with `handle` prefix.
```
tsx
function ParentComponent() {
const handleUserUpdate = (userData: UserData) => {
// Update user logic
};

return <UserForm onSubmit={handleUserUpdate} />;
}
```
## TanStack Router

### File-Based Routing

- Use the file-based routing system of TanStack Router for organized route definition.
- Place route files in the `src/routes` directory following the TanStack Router conventions.
```
tsx
// src/routes/users.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
component: Users,
});

function Users() {
// Component implementation
}
```
### Route Parameters

- Define route parameters using TanStack Router's parameter syntax.
- Validate and type parameters using TypeScript and TanStack Router's validation features.
```
tsx
// src/routes/users/$userId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/users/$userId")({
validateParams: (params) => ({
userId: z.string().min(1).parse(params.userId),
}),
component: UserDetail,
});

function UserDetail() {
const { userId } = Route.useParams();
// Component implementation using userId
}
```
### Route Loaders

- Use route loaders to prefetch data needed for a route.
- Handle loading states and errors gracefully.
```
tsx
export const Route = createFileRoute("/users/$userId")({
loader: ({ params }) => {
return queryClient.ensureQueryData({
queryKey: ["user", params.userId],
queryFn: () => fetchUser(params.userId),
});
},
component: UserDetail,
});
```
### Nested Routing

- Use nested routes for hierarchical UI structures.
- Share layouts between related routes using parent routes.
```
tsx
// src/routes/users/__layout.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/users/")({
component: UsersLayout,
});

function UsersLayout() {
return (
<div className="users-layout">
<UsersNavigation />
<div className="content">
<Outlet /> {/* Child routes will render here */}
</div>
</div>
);
}
```
## TanStack Query

### Query Keys

- Use structured and consistent query keys for caching and invalidation.
- Organize query keys hierarchically for related data.
```
tsx
// Good query key structure
const userKey = ["users", userId];
const userSettingsKey = ["users", userId, "settings"];

// Use these in query functions
const { data: user } = useQuery({
queryKey: userKey,
queryFn: () => fetchUser(userId),
});
```
### Query Functions

- Isolate API calls in separate functions outside of the query hook.
- Handle errors and edge cases in query functions.
```
tsx
// API function
async function fetchUser(userId: string): Promise<User> {
const response = await axios.get(`/api/users/${userId}`);
if (response.status !== 200) {
throw new Error(`Failed to fetch user: ${response.statusText}`);
}
return response.data;
}

// In component
const { data, error, isLoading } = useQuery({
queryKey: ["users", userId],
queryFn: () => fetchUser(userId),
});
```
### Data Mutations

- Use mutations for data modification operations.
- Update the cache after mutations using `invalidateQueries` or `setQueryData`.
```
tsx
const updateUserMutation = useMutation({
mutationFn: updateUser,
onSuccess: (data, variables) => {
// Invalidate affected queries
queryClient.invalidateQueries({ queryKey: ["users", variables.id] });

    // Or update cache directly
    queryClient.setQueryData(["users", variables.id], data);
},
});
```
### Query Options

- Configure appropriate staleTime and cacheTime based on data volatility.
- Use retry and retryDelay options for transient failures.
```
tsx
const { data } = useQuery({
queryKey: ["users"],
queryFn: fetchUsers,
staleTime: 5 * 60 * 1000, // 5 minutes
cacheTime: 30 * 60 * 1000, // 30 minutes
retry: 3,
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```
### Global Query Configuration

- Set up sensible global defaults in the QueryClient configuration.
- Configure global error handling and retry logic.
```
tsx
// src/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
defaultOptions: {
queries: {
staleTime: 60 * 1000, // 1 minute
cacheTime: 10 * 60 * 1000, // 10 minutes
retry: 2,
refetchOnWindowFocus: process.env.NODE_ENV === "production",
},
mutations: {
retry: 1,
},
},
});
```
## State Management

### Component State

- Use `useState` for simple component-level state.
- Consider using `useReducer` for complex state logic within a component.
```
tsx
// Using useState
const [users, setUsers] = useState<User[]>([]);

// Using useReducer for complex state
const [state, dispatch] = useReducer(userReducer, initialState);
```
### Context API

- Use React Context for state that needs to be accessed by multiple components.
- Keep context providers focused on specific concerns.
```
tsx
// src/contexts/AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
const [user, setUser] = useState<User | null>(null);

// Auth-related logic here

return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);
if (context === undefined) {
throw new Error("useAuth must be used within an AuthProvider");
}
return context;
}
```
### Global State

- Leverage TanStack Query for server state management.
- For client-only global state, use React Context or a lightweight state management library if needed.

## Component Design

### Atomic Design Methodology

- Organize components following atomic design principles:
  - **Atoms**: Basic building blocks (buttons, inputs, icons)
  - **Molecules**: Groups of atoms (form fields, card headers)
  - **Organisms**: Complex UI sections (forms, data tables)
  - **Templates**: Page layouts
  - **Pages**: Specific instances of templates with real data

### Component API Design

- Keep component APIs intuitive and consistent.
- Use composition over complex prop APIs.
```
tsx
// Good: Using composition
<Card>
<Card.Header>User Profile</Card.Header>
<Card.Body>
<UserDetails user={user} />
</Card.Body>
<Card.Footer>
<Button>Edit</Button>
</Card.Footer>
</Card>

// Avoid: Too many props
<Card
title="User Profile"
footerButtons={[{ label: 'Edit', onClick: handleEdit }]}
user={user}
/>
```
### Error Boundaries

- Implement error boundaries to prevent UI crashes.
- Provide meaningful fallback UIs.
```
tsx
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
fallback?: ReactNode;
children: ReactNode;
}

interface ErrorBoundaryState {
hasError: boolean;
error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
constructor(props: ErrorBoundaryProps) {
super(props);
this.state = { hasError: false };
}

static getDerivedStateFromError(error: Error): ErrorBoundaryState {
return { hasError: true, error };
}

componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
console.error('ErrorBoundary caught an error:', error, errorInfo);
// Log to error monitoring service
}

render(): ReactNode {
if (this.state.hasError) {
return this.props.fallback || <div>Something went wrong.</div>;
}

    return this.props.children;
}
}

export default ErrorBoundary;
```
## TypeScript Usage

### Type Definitions

- Define robust interfaces and types for all components, hooks, and functions.
- Place shared types in a dedicated `types` directory.
```
tsx
// src/types/user.ts
export interface User {
id: string;
name: string;
email: string;
role: 'Admin' | 'User' | 'Manager';
status: 'active' | 'inactive' | 'pending';
createdAt: string;
updatedAt: string;
}
```
### Type Safety

- Avoid using `any` type, use proper typing or `unknown` when necessary.
- Use type narrowing and type guards for runtime type checking.
```
tsx
// Type narrowing example
function processData(data: unknown): string {
if (typeof data === 'string') {
return data.toUpperCase();
}

if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
return data.join(', ').toUpperCase();
}

throw new Error('Invalid data format');
}
```
### Generic Components

- Use generics for components that work with different data types.
```
tsx
interface DataTableProps<T> {
data: T[];
columns: Array<{
key: keyof T;
header: string;
render?: (item: T) => ReactNode;
}>;
onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string }>({ data, columns, onRowClick }: DataTableProps<T>) {
// Component implementation
}
```
## Performance Optimization

### Memoization

- Use `useMemo` for expensive calculations.
- Use `useCallback` for function references passed to child components.
```
tsx
// Memoize expensive calculations
const sortedUsers = useMemo(() => {
return [...users].sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Memoize callback functions
const handleUserEdit = useCallback((userId: string) => {
// Edit user logic
}, [/* dependencies */]);
```
### React.memo

- Use `React.memo` for components that render often but with the same props.
- Implement custom equality functions for complex prop objects.
```
tsx
const UserCard = React.memo(function UserCard({ user, onEdit }: UserCardProps) {
// Component implementation
});

// With custom equality check
const UserCard = React.memo(
function UserCard({ user, onEdit }: UserCardProps) {
// Component implementation
},
(prevProps, nextProps) => {
return prevProps.user.id === nextProps.user.id &&
prevProps.user.lastUpdated === nextProps.user.lastUpdated;
}
);
```
### Code Splitting

- Use dynamic imports for route-based code splitting.
- Lazy load components that are not immediately needed.
```
tsx
// Dynamic import with React.lazy
const Settings = React.lazy(() => import('./pages/Settings'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
<Settings />
</Suspense>
```
### Virtual Lists

- Use virtualization for long lists to improve performance.
- Consider libraries like `react-virtual` or `react-window`.
```
tsx
// Example with react-virtual
function UserList({ users }: { users: User[] }) {
const { rows } = useVirtualizer({
count: users.length,
getScrollElement: () => parentRef.current,
estimateSize: () => 50,
});

return (
<div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
<div style={{ height: `${rows.totalSize}px`, position: 'relative' }}>
{rows.map((row) => (
<div
key={users[row.index].id}
style={{
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: `${row.size}px`,
transform: `translateY(${row.start}px)`,
}}
>
<UserCard user={users[row.index]} />
</div>
))}
</div>
</div>
);
}
```
## Testing Approach

### Unit Testing

- Test individual components, hooks, and utility functions.
- Focus on behavior rather than implementation details.
```
tsx
// Button component test
test('Button triggers onClick when clicked', () => {
const handleClick = vi.fn();
render(<Button onClick={handleClick}>Click Me</Button>);

userEvent.click(screen.getByText('Click Me'));

expect(handleClick).toHaveBeenCalledTimes(1);
});
```
### Integration Testing

- Test component integration and interactions.
- Mock external dependencies using tools like MSW.
```
tsx
// User list integration test
test('User list displays users from API', async () => {
// Setup MSW to mock API response
server.use(
rest.get('/api/users', (req, res, ctx) => {
return res(ctx.json([
{ id: '1', name: 'John Doe', email: 'john@example.com' },
{ id: '2', name: 'Jane Smith', email: 'jane@example.com' }
]));
})
);

render(<UserList />);

// Wait for users to be displayed
await screen.findByText('John Doe');

expect(screen.getByText('John Doe')).toBeInTheDocument();
expect(screen.getByText('Jane Smith')).toBeInTheDocument();
});
```
### End-to-End Testing

- Use Playwright for critical user flows.
- Focus on key user journeys rather than exhaustive testing.
```
typescript
// Playwright E2E test example
test('User can log in and access dashboard', async ({ page }) => {
await page.goto('/login');

await page.fill('input[name="email"]', 'test@example.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');

// Verify redirect to dashboard
await expect(page).toHaveURL('/dashboard');
await expect(page.getByText('Welcome back')).toBeVisible();
});
```
### Component Stories

- Create Storybook stories for component variations.
- Use stories for visual testing and documentation.
```
tsx
// UserCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from './UserCard';

const meta: Meta<typeof UserCard> = {
component: UserCard,
title: 'Components/UserCard',
tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const Default: Story = {
args: {
user: {
id: '1',
name: 'John Doe',
email: 'john@example.com',
role: 'User',
status: 'active',
},
},
};

export const AdminUser: Story = {
args: {
user: {
id: '2',
name: 'Jane Smith',
email: 'jane@example.com',
role: 'Admin',
status: 'active',
},
},
};
```
## Styling Guidelines

### Mantine Components

- Use Mantine components for consistent UI.
- Follow Mantine's theming and customization approach.
```
tsx
// Configure Mantine theme
const theme = createTheme({
colors: {
adminBlue: [
'#e9f0ff',
'#ccd8ff',
'#a9bcff',
'#839dff',
'#6582ff',
'#4e6aff',
'#3b54ff',
'#2a42e6',
'#1a33cf',
'#0024b8',
],
},
primaryColor: 'adminBlue',
fontFamily: 'Inter, sans-serif',
defaultRadius: 'md',
});

// Use Mantine components
function UserProfile({ user }: { user: User }) {
return (
<Card shadow="sm" padding="lg" radius="md" withBorder>
<Card.Section p="md">
<Group>
<Avatar size="xl" src={user.avatar} alt={user.name} radius="xl" />
<div>
<Text fw={500} size="lg">{user.name}</Text>
<Text c="dimmed" size="sm">{user.email}</Text>
</div>
</Group>
</Card.Section>
<Divider my="sm" />
<Text size="sm">
Role: <Badge color={user.role === 'Admin' ? 'blue' : 'gray'}>{user.role}</Badge>
</Text>
</Card>
);
}
```
### CSS Approach

- Use Mantine's styling system for component-specific styles.
- Use global CSS variables for design tokens.
```
tsx
// Using Mantine's styling
function CustomComponent() {
return (
<Box
style={(theme) => ({
backgroundColor: theme.colors.gray[0],
padding: theme.spacing.md,
borderRadius: theme.radius.md,
boxShadow: theme.shadows.sm,
})}
>
Content
</Box>
);
}
```
### Theme Consistency

- Maintain consistent spacing, colors, and typography using theme tokens.
- Avoid hardcoded values for colors, spacing, and other design properties.
```
tsx
// Good: Using theme tokens
<Box p="md" m="sm" bg="gray.1" style={{ borderRadius: theme.radius.md }}>

// Avoid: Hardcoded values
<Box style={{ padding: '16px', margin: '8px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
```
## API Integration

### API Client Setup

- Use Axios with interceptors for consistent API handling.
- Centralize API configuration and error handling.

```tsx
// src/lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```
```


### API Services

- Create service modules for different API domains.
- Keep API calls separate from components.

```textmate
// src/services/users-service.ts
import apiClient from '../lib/api-client';
import type { User, UserCreateData, UserUpdateData } from '../types/user';

export async function getUsers(params?: { page?: number; limit?: number }): Promise<User[]> {
  const response = await apiClient.get('/users', { params });
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data: UserCreateData): Promise<User> {
  const response = await apiClient.post('/users', data);
  return response.data;
}

export async function updateUser(id: string, data: UserUpdateData): Promise<User> {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
```


### Error Handling

- Implement consistent error handling for API requests.
- Show user-friendly error messages.

```textmate
// Hook for API error handling
function useApiError() {
  const { showNotification } = useNotifications();
  
  const handleApiError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 404) {
        showNotification({
          title: 'Resource Not Found',
          message,
          color: 'orange',
        });
      } else if (status === 403) {
        showNotification({
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          color: 'red',
        });
      } else {
        showNotification({
          title: 'Error',
          message: message || 'An unexpected error occurred',
          color: 'red',
        });
      }
    } else {
      showNotification({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    }
  }, [showNotification]);
  
  return { handleApiError };
}
```


## Project Structure

### Directory Organization

```
src/
├── assets/             # Static assets like images, fonts
├── components/         # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Form/           # Form-related components
│   └── UI/             # Generic UI components
├── contexts/           # React context providers
├── hooks/              # Custom hooks
├── lib/                # Utility libraries and setup
│   ├── api-client.ts   # API client setup
│   └── query-client.ts # TanStack Query client setup
├── routes/             # Route components (TanStack Router)
├── services/           # API service modules
├── stores/             # State management stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```


### Naming Conventions

- **Files**: Use PascalCase for component files (e.g., `UserCard.tsx`).
- **Directories**: Use kebab-case for directories (e.g., `user-settings/`).
- **Functions**: Use camelCase for functions and methods.
- **Components**: Use PascalCase for component names.
- **Hooks**: Prefix with `use` (e.g., `useUserData`).
- **Context**: Suffix with `Context` (e.g., `AuthContext`).
- **Types/Interfaces**: Use PascalCase (e.g., `UserProfile`).

## Code Reviews

### Review Checklist

Before submitting code for review, ensure the following:

1. **Code Quality**
  - Code follows the patterns and practices outlined in this document
  - No TypeScript errors or warnings
  - ESLint and Prettier rules are satisfied
  - No unnecessary console logs or comments

2. **Testing**
  - New components have appropriate tests
  - Test coverage is maintained or improved
  - All tests pass

3. **Performance**
  - No obvious performance issues (unnecessary re-renders, etc.)
  - Heavy operations are memoized where appropriate

4. **Accessibility**
  - Components use semantic HTML
  - Interactive elements are keyboard accessible
  - Proper ARIA attributes are used where needed

5. **Security**
  - No sensitive data exposed in client code
  - User inputs are properly validated
  - Authentication and authorization checks are in place

6. **Documentation**
  - Code is self-documenting where possible
  - Complex logic has explanatory comments
  - New components have Storybook stories
