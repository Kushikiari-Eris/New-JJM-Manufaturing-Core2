
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import jjm from '/jjm.jpg'

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    
    <aside
      className={` h-screen bg-white text-gray-900 p-4 transition-all duration-300 border-x ${
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
              className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                ECOMMERCE
            </span>
            <li>
              <a className="flex items-center gap-x-3 py-2 px-1   text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/dashboard">
                  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"  className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                  </svg>
                  <span
                  className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
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
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
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
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                    Orders
                  </span>
                </a>
            </li>
          </ul>

          <ul className="space-y-1">
              <span
                className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                  PRODUCT EXECUTION
              </span>
              <li>
                <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/finishProduct">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span
                    className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                      Finish Product
                    </span>
                  </a>
              </li>
              <li>
                <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/rawMaterialRequest">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span
                    className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                      Request Raw Material
                    </span>
                  </a>
              </li>
          </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
