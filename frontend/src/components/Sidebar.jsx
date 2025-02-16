
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import jjm from '/jjm.jpg'

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`h-screen bg-white text-gray-900 p-4 transition-all duration-300 shadow border ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <button onClick={toggleSidebar} className=" bg-white border rounded-full p-1 shadow-md transition-all duration-300 hover:scale-110">
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div
        className={`transition-all duration-200 ${
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
        }`}
      >
        <img src={jjm} alt="JJM Logo" className="transition-opacity duration-300" />
      </div>

      <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
        
          <ul className="space-y-1">

            <span
              className={`transition-all font-bold text-xs duration-200 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
                  }`}
                >
                MENU
            </span>
            <li>
              <a className="flex items-center gap-x-3 py-2 px-1   text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"  className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                  </svg>
                  <span
                  className={`transition-all font-medium duration-200 ${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
                      }`}
                    >
                    Dashboard
                  </span>
                </a>
            </li>

            <li>
              <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/product">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  <span
                  className={`transition-all font-medium duration-200 ${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
                      }`}
                    >
                    Product
                  </span>
                </a>
            </li>

            <li>
              <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/orders">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span
                  className={`transition-all font-medium duration-200 ${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
                      }`}
                    >
                    Orders
                  </span>
                </a>
            </li>
          </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
