import AppProvider from "@/app/providers/AppProvider";
import { AppRouter } from "@/app/providers/RouterProvider";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
