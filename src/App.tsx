import { ThemeProvider } from "./components/theme-provider";
import Landing from "./components/landing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatsProvider } from "./contexts/statsContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <StatsProvider>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <Landing />
                </ThemeProvider>
            </StatsProvider>
        </QueryClientProvider>
    );
}

export default App;
