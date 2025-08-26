import { createTheme, MantineColorsTuple } from "@mantine/core";

// Custom color palette for admin portal
const adminBlue: MantineColorsTuple = [
  "#e3f2fd",
  "#bbdefb",
  "#90caf9",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1",
];

const adminGreen: MantineColorsTuple = [
  "#e8f5e8",
  "#c8e6c9",
  "#a5d6a7",
  "#81c784",
  "#66bb6a",
  "#4caf50",
  "#43a047",
  "#388e3c",
  "#2e7d32",
  "#1b5e20",
];

const adminRed: MantineColorsTuple = [
  "#ffebee",
  "#ffcdd2",
  "#ef9a9a",
  "#e57373",
  "#ef5350",
  "#f44336",
  "#e53935",
  "#d32f2f",
  "#c62828",
  "#b71c1c",
];

const adminGray: MantineColorsTuple = [
  "#fafafa",
  "#f5f5f5",
  "#eeeeee",
  "#e0e0e0",
  "#bdbdbd",
  "#9e9e9e",
  "#757575",
  "#616161",
  "#424242",
  "#212121",
];

export const adminTheme = createTheme({
  colors: {
    adminBlue,
    adminGreen,
    adminRed,
    adminGray,
  },
  primaryColor: "adminBlue",
  primaryShade: { light: 6, dark: 8 },

  // Typography configuration
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  fontFamilyMonospace:
    'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "2rem", lineHeight: "1.2" },
      h2: { fontSize: "1.75rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
      h4: { fontSize: "1.25rem", lineHeight: "1.4" },
      h5: { fontSize: "1.125rem", lineHeight: "1.4" },
      h6: { fontSize: "1rem", lineHeight: "1.4" },
    },
  },

  // Spacing configuration
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // Border radius configuration
  radius: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },

  // Shadows configuration
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    sm: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    md: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    lg: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
    xl: "0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)",
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },

  // Component overrides
  components: {
    Card: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
      },
    },
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "md",
      },
    },
  },
});

// Theme utilities
export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "success":
    case "online":
      return "adminGreen";
    case "inactive":
    case "error":
    case "offline":
      return "adminRed";
    case "warning":
    case "pending":
      return "yellow";
    case "suspended":
      return "orange";
    default:
      return "adminGray";
  }
};

export const getRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
    case "administrator":
      return "adminRed";
    case "moderator":
    case "manager":
      return "adminBlue";
    case "user":
    case "member":
      return "adminGray";
    default:
      return "gray";
  }
};
