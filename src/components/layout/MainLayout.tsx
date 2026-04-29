import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header/Index";
import Sidebar from "@/components/layout/SideBar/Index";
import Footer from "@/components/layout/Footer/Index";

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header onMenuToggle={() => setMobileMenuOpen(true)} />

      {/* Contenido principal */}
      <div className="h-[calc(100vh_-_128px)] flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar mobileMenuOpen={mobileMenuOpen} closeMobileMenu={() => setMobileMenuOpen(false)} />

        {/* Vistas */}
        <main className="!w-full !h-full flex-1 bg-gray-50 p-6 overflow-auto rounded-xl">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;
