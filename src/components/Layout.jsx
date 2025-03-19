import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="p-6 bg-white text-center text-3xl font-extrabold border-b border-gray-300 shadow-md">
        📸 putolok
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="border border-gray-400 bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-white text-center text-sm text-gray-600 border-t border-gray-300 shadow-md">
        &copy; {new Date().getFullYear()} Otkhodylinz_™ - rizkywhaqiqi
      </footer>
    </div>
  );
}

export default Layout;
