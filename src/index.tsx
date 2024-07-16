import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError, AxiosResponse } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

// TODO move it from here after 7th task crosscheck
const showToaster = (result: AxiosResponse) => {
  switch (result.status) {
    case 200:
      toast.success(
        result?.data?.message || result?.statusText || "Successfully uploaded"
      );
      break;
    case 401:
      toast.error(
        result?.data?.message || result?.statusText || "Unauthorized"
      );
      break;
    case 403:
      toast.error(
        result?.data?.message || result?.statusText || "Invalid credentials"
      );
    default:
      toast.error(
        result?.data?.message || result?.statusText || "Unknown error"
      );
  }
};

// TODO move it from here after 7th task crosscheck
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    showToaster(response);

    return Promise.resolve(response);
  },
  (error: AxiosError) => {
    if (error?.response) {
      showToaster(error?.response);
    }

    return Promise.reject(error);
  }
);

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
          <Toaster />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
