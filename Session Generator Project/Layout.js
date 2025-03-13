import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Users, PanelLeft, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", path: "Dashboard", icon: Home },
  { name: "Explore", path: "Explore", icon: Users }
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-sm transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6">
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
            <Music className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Session Master</span>
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-6 w-6" />
          </Button>
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-600" />
            <span className="font-bold">Session Master</span>
          </Link>
          <div className="w-6"></div> {/* For balance */}
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}