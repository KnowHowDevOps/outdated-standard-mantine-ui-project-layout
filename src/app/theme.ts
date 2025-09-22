import { createTheme, MantineColorsTuple } from "@mantine/core";

// Define custom colors
const primary: MantineColorsTuple = [
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

const secondary: MantineColorsTuple = [
  "#fce4ec",
  "#f8bbd9",
  "#f48fb1",
  "#f06292",
  "#ec407a",
  "#e91e63",
  "#d81b60",
  "#c2185b",
  "#ad1457",
  "#880e4f",
];

export const theme = createTheme({
  colors: {
    primary,
    secondary,
  },
  primaryColor: "primary",
  defaultRadius: "md",
  fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});
