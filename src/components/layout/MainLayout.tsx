import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header/Index";
import { useHeaderScript } from "@/hooks/useHeaderScript";
import Sidebar from "@/components/layout/SideBar/Index";
import Footer from "@/components/layout/Footer/Index";

function MainLayout() {
  useHeaderScript();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Vistas */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;
