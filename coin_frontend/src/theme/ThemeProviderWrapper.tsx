'use client';

import React from "react";
import theme from "@/theme/theme";
import {ThemeProvider} from "@mui/system";
import {CssBaseline} from "@mui/material";

export default function ThemeProviderWrapper({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}