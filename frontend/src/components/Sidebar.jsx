
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import jjm from '/jjm.jpg'
import { useUserStore } from "../stores/useUserStore";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user } = useUserStore();
  const isAudit = user?.role === "audit";
  const isAuditor = user?.role === "auditor";


  return (
    
    <aside
      className={`   h-screen text-gray-900 p-4 transition-all duration-300 border-x ${
        isCollapsed ? "w-16" : "w-64"
      } ${isAuditor ? "bg-gradient-to-b from-green-400 via-green-500 to-green-700 " : "bg-white"}`}
    >
      <button onClick={toggleSidebar} className=" bg-white border rounded-full p-1 shadow-md transition-all duration-300 hover:scale-110">
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div
        className={`transition-all flex items-center gap-x-3 duration-200 ${
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-14"
        } ${isAuditor ? "justify-center w-24 ml-14  " : ""}`} // Center the image if isAuditor
      >
        <img
          src={jjm}
          alt="JJM Logo"
          className="transition-opacity duration-300 rounded-lg"
        />
        {!isAuditor && (
          <span className="text-2xl font-semibold">Dashboard</span> // Show text only if not isAuditor
        )}
      </div>

        {isAudit ? (
          <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
        
            <ul className="space-y-1">

                <span
                  className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        > 
                    MENU
                </span>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditDashboard">
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
                <span
                  className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                    AUDIT MANAGEMENT
                </span>
                <li className="relative group">
                  <a className="flex items-center gap-x-3  py-2 px-1 cursor-pointer  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span
                      className={`transition-all font-medium duration-200 ${
                        isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                      }`}
                    >
                    Audit Requests
                    </span>
                  </a>

                  {/* Dropdown */}
                  <ul
                    className="absolute left-0 w-48 mt-2 space-y-1 bg-white border border-gray-200 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 dark:bg-neutral-700 dark:border-gray-600"
                  >
                    <li>
                      <a href="/auditRequestHr" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Hr Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestAdmin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Admin Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestFinance" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Finance Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestLogistic" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Logistic Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestCore" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Core Requests
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditTask">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>
                      <span
                      className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                        Audit Tasks
                      </span>
                    </a>
                </li>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditReports">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                      </svg>
                      <span
                      className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                        Audit Reports
                      </span>
                    </a>
                </li>
              </ul>
            </div>
        ) : isAuditor ? (
            <>
            <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
        
            <ul className="space-y-1">
                <span
                  className={`transition-all font-bold text-white duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                    AUDIT MANAGEMENT
                </span>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-white rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditorDashboard">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
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
                  <a className="flex items-center gap-x-3 py-2 px-1   text-white rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditPendingTask">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>


                      <span
                      className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                        Pending Task
                      </span>
                    </a>
                </li>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-white rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditInProgressTask">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>

                      <span
                      className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                        In Progress Task
                      </span>
                    </a>
                </li>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1   text-white rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditCompletedTask">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                      </svg>

                      <span
                      className={`transition-all font-medium duration-200 ${
                            isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                          }`}
                        >
                        Completed Task
                      </span>
                    </a>
                </li>
              </ul>
            </div>
            </>
        ) : (
          <>
            <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
          
            <ul className="space-y-1">

              <span
                className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                  ONLINE STORE
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
                  <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/workOrders">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                      </svg>

                      <span
                      className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                        Work Orders
                      </span>
                    </a>
                </li>
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/productExecution">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span
                      className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                        Product Execution
                      </span>
                    </a>
                </li>
                <span
                  className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                    INVENTORY MANAGEMENT
                </span>
                 <li>
                  <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/inventory">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                      </svg>

                      <span
                      className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                        Inventory
                      </span>
                    </a>
                </li>
                <span
                  className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                    MAINTENANCE
                </span>
                 <li>
                  <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/maintenance">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                      </svg>
                      <span
                      className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                        Maintenance
                      </span>
                    </a>
                </li>
                <span
                  className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                    SMART SCHEDULING
                </span>
                 <li>
                  <a className="flex items-center gap-x-3 py-2 px-1  text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/schedule">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                      </svg>
                      <span
                      className={`transition-all font-medium duration-200 ${
                          isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"
                        }`}
                      >
                        Schedule
                      </span>
                    </a>
                </li>
            </ul>
        </div>
          </>
        )}
    </aside>
  );
};

export default Sidebar;
