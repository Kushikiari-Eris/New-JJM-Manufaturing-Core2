import { createContext, useState, useContext } from "react";
import { useUserStore } from "../stores/useUserStore";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // New state for mobile sidebar

  const { user } = useUserStore();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev); // Toggle for mobile

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar, user }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
