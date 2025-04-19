
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  LogOut,
  UserSquare2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard-admin",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      name: "Projetos",
      path: "/projetos",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      name: "Cadastrar Professor",
      path: "/cadastro-professor-admin",
      icon: <UserPlus className="h-5 w-5 mr-2" />,
    },
    {
      name: "Professores",
      path: "/professores",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      name: "Grupos",
      path: "/grupos",
      icon: <UserSquare2 className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r bg-white">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-2xl font-bold text-primary">Atlas</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {user?.login?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.login}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 left-4 z-10"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b">
              <h1 className="text-2xl font-bold text-blue-600">Atlas</h1>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-gray-700 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user?.login?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.login}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white shadow-sm h-16 flex items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600 mx-auto">Atlas</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
