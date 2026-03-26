import { RouterProvider } from "react-router-dom";
import { router } from "./router";
// Importamos nuestro proveedor de contexto
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    // Envolvemos el Router con el AuthProvider
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
