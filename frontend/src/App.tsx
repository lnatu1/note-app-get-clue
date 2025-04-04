import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "./store/useAuthStore";
import Home from "./pages/Home";
import Register from "./pages/Register";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const isRegistered = useAuthStore((state) => state.isRegistered());

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen gradient px-4">
          <div className="max-w-2xl mx-auto w-full py-6">
            <Routes>
              <Route
                path="/"
                index
                element={
                  isRegistered ? <Home /> : <Navigate replace to="register" />
                }
              />

              <Route
                path="/register"
                element={
                  isRegistered ? <Navigate replace to="/" /> : <Register />
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
