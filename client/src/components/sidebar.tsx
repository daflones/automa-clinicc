import { Link, useLocation } from "wouter";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "fas fa-chart-line" },
    { path: "/funil-vendas", label: "Funil de Vendas", icon: "fas fa-filter" },
    { path: "/clientes", label: "Clientes", icon: "fas fa-users" },
    { path: "/agenda", label: "Agenda", icon: "fas fa-calendar-alt" },
    { path: "/procedimentos", label: "Procedimentos", icon: "fas fa-spa" },
    { path: "/relatorios", label: "Relatórios", icon: "fas fa-chart-bar" },
    { path: "/configuracoes", label: "Configurações", icon: "fas fa-cog" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Mobile sidebar toggle button
  const MobileMenuButton = () => (
    <button
      type="button"
      onClick={toggleSidebar}
      className={`${
        isOpen ? "hidden" : "block"
      } md:hidden fixed top-4 left-4 z-50 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary`}
    >
      <i className="fas fa-bars text-xl"></i>
    </button>
  );

  if (!isOpen) {
    return <MobileMenuButton />;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <MobileMenuButton />
      <aside
        className={`${
          isMobile
            ? "fixed inset-0 z-40 w-64 transition-transform transform"
            : "hidden md:flex md:flex-col w-64"
        } bg-sidebar border-r border-sidebar-border`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold font-heading text-white flex items-center">
            <span className="text-primary">Automa</span>Clinic
            <span className="text-accent">.ia</span>
          </h1>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b border-sidebar-border">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex items-center px-4 py-2.5 text-sm font-medium ${
                  location === item.path
                    ? "text-white bg-primary bg-opacity-20 border-l-4 border-primary"
                    : "text-gray-300 hover:bg-muted hover:text-white"
                }`}
              >
                <i
                  className={`${item.icon} w-5 h-5 mr-3 ${
                    location === item.path ? "text-primary" : "text-gray-400"
                  }`}
                ></i>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-4 border-t border-sidebar-border">
          <Link href="/ajuda">
            <a className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-muted hover:text-white">
              <i className="fas fa-question-circle w-5 h-5 mr-3 text-gray-400"></i>
              Ajuda & Suporte
            </a>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 mt-1 text-sm font-medium text-gray-300 rounded-md hover:bg-muted hover:text-white"
            onClick={logout}
          >
            <i className="fas fa-sign-out-alt w-5 h-5 mr-3 text-gray-400"></i>
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
