import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header/Index";
import { useHeaderScript } from "@/hooks/useHeaderScript";
import Sidebar from "@/components/layout/SideBar/Index";
import Footer from "@/components/layout/Footer/Index";

function MainLayout() {
  useHeaderScript();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <div className="h-[calc(100vh_-_128px)] flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Vistas */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto rounded-xl">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;
