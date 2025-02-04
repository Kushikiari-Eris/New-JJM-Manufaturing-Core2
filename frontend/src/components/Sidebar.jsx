
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`h-screen bg-white text-gray-900 p-4 transition-all duration-300 shadow border ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button onClick={toggleSidebar} className="text-gray-900 p-2">
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="hs-accordion-group pb-0 mt-20  w-full flex flex-col flex-wrap" >
          <ul className="space-y-1">
            <li>
              {isCollapsed ? (
                  <a className="flex items-center gap-x-3 py-2 px-2.5  text-sm text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </a>
                ) : (
                  <a className="flex items-center gap-x-3 py-2 px-2.5  text-sm text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    Dashboard
                  </a>
                )}
            </li>

            <li>
              {isCollapsed ? (
                  <a className="flex items-center gap-x-3 py-2 px-2.5  text-sm text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/product">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  </a>
                ) : (
                  <a className="flex items-center gap-x-3 py-2 px-2.5  text-sm text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/product">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                    Product
                  </a>
                )}
            </li>
          </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
