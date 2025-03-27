
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import jjm from '/jjm.jpg'
import { useUserStore } from "../stores/useUserStore";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar, user } = useSidebar();
  
  const isAudit = user?.role === "audit";
  const isAuditor = user?.role === "auditor";
  const isSuperAdmin = user?.role === "superadmin";



  return (
    <>
    <aside
      className={`   h-screen text-gray-900 z-50 transition-all duration-300 border-x overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pb-40 ${
        isCollapsed ? "w-16" : "w-64"
      } ${isAuditor ? "bg-white" : "bg-white"}`}
    >
      <button onClick={toggleSidebar} className="   p-2 transition-all duration-300 hover:scale-110">
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

        <div
          className={`transition-all flex justify-center items-center gap-x-1 duration-200 
            ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-50"} 
            ${isAuditor ? "w-50" : ""}`} // Remove ml-14 for proper centering
        >
          <img
            src={jjm}
            alt="JJM Logo"
            className="transition-opacity h-24 w-50 duration-300 rounded-lg"
          />
        </div>


        {(isAudit || isSuperAdmin) && (
          <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
        
            <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditDashboard">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14 20.5V4.25C14 3.52169 13.9984 3.05091 13.9518 2.70403C13.908 2.37872 13.8374 2.27676 13.7803 2.21967C13.7232 2.16258 13.6213 2.09197 13.296 2.04823C12.9491 2.00159 12.4783 2 11.75 2C11.0217 2 10.5509 2.00159 10.204 2.04823C9.87872 2.09197 9.77676 2.16258 9.71967 2.21967C9.66258 2.27676 9.59197 2.37872 9.54823 2.70403C9.50159 3.05091 9.5 3.52169 9.5 4.25V20.5H14Z" fill="#2ecc71"/>
                      <path opacity="0.7" d="M8 8.75C8 8.33579 7.66421 8 7.25 8H4.25C3.83579 8 3.5 8.33579 3.5 8.75V20.5H8V8.75Z" fill="#82e0aa"/>
                      <path opacity="0.7" d="M20 13.75C20 13.3358 19.6642 13 19.25 13H16.25C15.8358 13 15.5 13.3358 15.5 13.75V20.5H20V13.75Z" fill="#2ecc71"/>
                      <path opacity="0.5" d="M1.75 20.5C1.33579 20.5 1 20.8358 1 21.25C1 21.6642 1.33579 22 1.75 22H21.75C22.1642 22 22.5 21.6642 22.5 21.25C22.5 20.8358 22.1642 20.5 21.75 20.5H21.5H20H15.5H14H9.5H8H3.5H2H1.75Z" fill="#82e0aa"/>
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
              <li className="flex items-center text-gray-900 font-bold   ">
                <span
                  className={`transition-all  duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  AUDIT MANAGEMENT
                </span>
              </li>
                <li className="relative group">
                  <a className="flex items-center gap-x-1  py-2 px-5 cursor-pointer  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 7.75736 23 5.63604 21.7113 4.31802C20.4225 3 18.3484 3 14.2 3Z" fill="#2ecc71"/>
                    <path d="M19.1284 8.03302C19.4784 7.74133 19.5257 7.22112 19.234 6.87109C18.9423 6.52106 18.4221 6.47377 18.0721 6.76546L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L19.1284 8.03302Z" fill="#2ecc71"/>
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
                      <a href="/auditRequestHr" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Hr Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestAdmin" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Admin Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestFinance" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Finance Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestLogistic" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Logistic Requests
                      </a>
                    </li>
                    <li>
                      <a href="/auditRequestCore" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600">
                        Core Requests
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditTask">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" fill="#2ecc71"/>
                    <path d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z" fill="#2ecc71"/>
                    <path d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z" fill="#2ecc71"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H11C11.4142 12.25 11.75 12.5858 11.75 13C11.75 13.4142 11.4142 13.75 11 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="#2ecc71"/>
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
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditReports">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#2ecc71"/>
                      <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#2ecc71"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5483 10.4883C15.8309 10.7911 15.8146 11.2657 15.5117 11.5483L11.226 15.5483C10.9379 15.8172 10.4907 15.8172 10.2025 15.5483L8.48826 13.9483C8.18545 13.6657 8.16909 13.1911 8.45171 12.8883C8.73434 12.5855 9.20893 12.5691 9.51174 12.8517L10.7143 13.9741L14.4883 10.4517C14.7911 10.1691 15.2657 10.1855 15.5483 10.4883Z" fill="#2ecc71"/>
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
        )} 

          {(isAuditor || isSuperAdmin) && (
            <>
            <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
        
            <ul className="space-y-1">
              <li>
                <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg  hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditorDashboard">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14 20.5V4.25C14 3.52169 13.9984 3.05091 13.9518 2.70403C13.908 2.37872 13.8374 2.27676 13.7803 2.21967C13.7232 2.16258 13.6213 2.09197 13.296 2.04823C12.9491 2.00159 12.4783 2 11.75 2C11.0217 2 10.5509 2.00159 10.204 2.04823C9.87872 2.09197 9.77676 2.16258 9.71967 2.21967C9.66258 2.27676 9.59197 2.37872 9.54823 2.70403C9.50159 3.05091 9.5 3.52169 9.5 4.25V20.5H14Z" fill="#2ecc71"/>
                  <path opacity="0.7" d="M8 8.75C8 8.33579 7.66421 8 7.25 8H4.25C3.83579 8 3.5 8.33579 3.5 8.75V20.5H8V8.75Z" fill="#2ecc71"/>
                  <path opacity="0.7" d="M20 13.75C20 13.3358 19.6642 13 19.25 13H16.25C15.8358 13 15.5 13.3358 15.5 13.75V20.5H20V13.75Z" fill="#2ecc71"/>
                  <path opacity="0.5" d="M1.75 20.5C1.33579 20.5 1 20.8358 1 21.25C1 21.6642 1.33579 22 1.75 22H21.75C22.1642 22 22.5 21.6642 22.5 21.25C22.5 20.8358 22.1642 20.5 21.75 20.5H21.5H20H15.5H14H9.5H8H3.5H2H1.75Z" fill="#2ecc71"/>
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
              <li className="flex items-center text-gray-900 font-bold    ">
                <span
                  className={`transition-all duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  AUDITOR MANAGEMENT
                </span>
              </li>
                
                <li>
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditPendingTask">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z" fill="#2ecc71"/>
                    <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="#2ecc71"/>
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="#2ecc71"/>
                    <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="#2ecc71"/>
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
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditInProgressTask">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z" fill="#2ecc71"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="#2ecc71"/>
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
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/auditCompletedTask">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z" fill="#2ecc71"/>
                      <path d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#2ecc71"/>
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
        )} 
        
        {(!isAudit && !isAuditor) || isSuperAdmin ? (
          <>
            <div className="hs-accordion-group pb-0 mt-5 w-full flex flex-col flex-wrap">
          
            <ul className="space-y-1">
              

              <li>
                  <a className="flex items-center gap-x-1 py-2 px-5   text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/dashboard">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14 20.5V4.25C14 3.52169 13.9984 3.05091 13.9518 2.70403C13.908 2.37872 13.8374 2.27676 13.7803 2.21967C13.7232 2.16258 13.6213 2.09197 13.296 2.04823C12.9491 2.00159 12.4783 2 11.75 2C11.0217 2 10.5509 2.00159 10.204 2.04823C9.87872 2.09197 9.77676 2.16258 9.71967 2.21967C9.66258 2.27676 9.59197 2.37872 9.54823 2.70403C9.50159 3.05091 9.5 3.52169 9.5 4.25V20.5H14Z" fill="#2ecc71"/>
                      <path opacity="0.7" d="M8 8.75C8 8.33579 7.66421 8 7.25 8H4.25C3.83579 8 3.5 8.33579 3.5 8.75V20.5H8V8.75Z" fill="#82e0aa"/>
                      <path opacity="0.7" d="M20 13.75C20 13.3358 19.6642 13 19.25 13H16.25C15.8358 13 15.5 13.3358 15.5 13.75V20.5H20V13.75Z" fill="#2ecc71"/>
                      <path opacity="0.5" d="M1.75 20.5C1.33579 20.5 1 20.8358 1 21.25C1 21.6642 1.33579 22 1.75 22H21.75C22.1642 22 22.5 21.6642 22.5 21.25C22.5 20.8358 22.1642 20.5 21.75 20.5H21.5H20H15.5H14H9.5H8H3.5H2H1.75Z" fill="#82e0aa"/>
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

              <li className="flex items-center text-gray-900 font-bold   ">
                <span
                  className={`transition-all  duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  ONLINE STORE
                </span>
              </li>
              

              <li>
                <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/product">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M4.0828 10.8943C4.52171 8.55339 4.74117 7.38295 5.57434 6.69147C6.40752 6 7.59835 6 9.98003 6H14.0209C16.4026 6 17.5934 6 18.4266 6.69147C19.2598 7.38295 19.4792 8.55339 19.9181 10.8943L20.6681 14.8943C21.2853 18.186 21.5939 19.8318 20.6942 20.9159C19.7945 22 18.12 22 14.7709 22H9.23003C5.88097 22 4.20644 22 3.30672 20.9159C2.40701 19.8318 2.7156 18.186 3.3328 14.8943L4.0828 10.8943Z" fill="#2ecc71"/>
                    <path d="M9.75 5C9.75 3.75736 10.7574 2.75 12 2.75C13.2426 2.75 14.25 3.75736 14.25 5V6C14.25 5.99999 14.25 6.00001 14.25 6C14.816 6.00018 15.3119 6.00174 15.7499 6.01488C15.75 6.00993 15.75 6.00497 15.75 6V5C15.75 2.92893 14.0711 1.25 12 1.25C9.92893 1.25 8.25 2.92893 8.25 5V6C8.25 6.00498 8.25005 6.00995 8.25015 6.01491C8.68814 6.00175 9.18397 6.00021 9.75 6.00002C9.75 6.00002 9.75 6.00003 9.75 6.00002V5Z" fill="#2ecc71"/>
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
                <a className="flex items-center gap-x-1 py-2 px-5 mb-1  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/orders">
                    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.28869 2.76279C1.41968 2.36983 1.84442 2.15746 2.23737 2.28845L2.50229 2.37675C2.51549 2.38115 2.52864 2.38554 2.54176 2.38991C3.16813 2.59867 3.69746 2.7751 4.11369 2.96873C4.55613 3.17456 4.94002 3.42965 5.23112 3.83352C5.52221 4.2374 5.64282 4.68226 5.69817 5.16708C5.75025 5.62318 5.75023 6.18114 5.7502 6.84139L5.7502 9.49996C5.7502 10.9354 5.7518 11.9365 5.85335 12.6918C5.952 13.4256 6.13245 13.8142 6.40921 14.091C6.68598 14.3677 7.07455 14.5482 7.80832 14.6468C8.56367 14.7484 9.56479 14.75 11.0002 14.75H18.0002C18.4144 14.75 18.7502 15.0857 18.7502 15.5C18.7502 15.9142 18.4144 16.25 18.0002 16.25H10.9453C9.57774 16.25 8.47542 16.25 7.60845 16.1334C6.70834 16.0124 5.95047 15.7535 5.34855 15.1516C4.74664 14.5497 4.48774 13.7918 4.36673 12.8917C4.25017 12.0247 4.25018 10.9224 4.2502 9.55484L4.2502 6.883C4.2502 6.17 4.24907 5.69823 4.20785 5.33722C4.16883 4.99538 4.10068 4.83049 4.01426 4.71059C3.92784 4.59069 3.79296 4.47389 3.481 4.32877C3.15155 4.17551 2.70435 4.02524 2.02794 3.79978L1.76303 3.71147C1.37008 3.58049 1.15771 3.15575 1.28869 2.76279Z" fill="#2ecc71"/>
                    <path opacity="0.5" d="M5.74512 6C5.75008 6.25912 5.75008 6.53957 5.75007 6.8414L5.75006 9.5C5.75006 10.9354 5.75166 11.9365 5.85321 12.6919C5.86803 12.8021 5.8847 12.9046 5.90326 13H16.0221C16.9815 13 17.4612 13 17.8369 12.7523C18.2126 12.5045 18.4016 12.0636 18.7795 11.1818L19.2081 10.1818C20.0176 8.29294 20.4223 7.34853 19.9777 6.67426C19.5331 6 18.5056 6 16.4507 6H5.74512Z" fill="#2ecc71"/>
                    <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" fill="#2ecc71"/>
                    <path d="M18 19.5001C18 18.6716 17.3284 18.0001 16.5 18.0001C15.6716 18.0001 15 18.6716 15 19.5001C15 20.3285 15.6716 21.0001 16.5 21.0001C17.3284 21.0001 18 20.3285 18 19.5001Z" fill="#2ecc71"/>
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
              <li className="flex items-center text-gray-900 font-bold   ">
                <span
                  className={`transition-all  duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  PRODUCT EXECUTION
                </span>
              </li>
                <li>
                  <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/workOrders">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.25 4.47954L14.25 7.5372C14.2498 7.64842 14.2496 7.80699 14.2709 7.9431C14.2969 8.10951 14.3824 8.43079 14.7151 8.62611C15.0355 8.81422 15.3488 8.74436 15.4978 8.69806C15.6276 8.6577 15.77 8.58988 15.8762 8.5393L17 8.00545L18.1238 8.5393C18.23 8.58987 18.3724 8.6577 18.5022 8.69806C18.6512 8.74436 18.9645 8.81422 19.2849 8.62611C19.6176 8.43079 19.7031 8.10952 19.7291 7.9431C19.7504 7.807 19.7502 7.64845 19.75 7.53723L19.75 3.0313C19.8628 3.026 19.9736 3.02152 20.0818 3.01775C21.1536 2.98041 21.9998 3.86075 21.9998 4.93319V16.1436C21.9998 17.2546 21.0938 18.1535 19.985 18.2228C19.0155 18.2835 17.8765 18.402 16.9998 18.6334C15.9184 18.9187 15.0106 19.7008 13.6274 20.0692C13.0013 20.236 12.3029 20.3257 12 20.3925V5.17387C12.3208 5.0953 13.3822 4.97142 13.6737 4.80275C13.8579 4.6961 14.0512 4.58732 14.25 4.47954ZM19.7276 12.8181C19.8281 13.2199 19.5837 13.6271 19.1819 13.7276L15.1819 14.7276C14.7801 14.8281 14.3729 14.5837 14.2724 14.1819C14.1719 13.7801 14.4163 13.3729 14.8181 13.2724L18.8181 12.2724C19.2199 12.1719 19.6271 12.4163 19.7276 12.8181Z" fill="#16a085"/>
                    <path d="M18.25 3.15101C17.63 3.22431 17.0204 3.33159 16.4998 3.48744C16.2583 3.55975 16.0062 3.65141 15.75 3.7564V3.95002V6.93859L16.4993 6.58266L16.5081 6.57822C16.5571 6.55316 16.7636 6.44757 17 6.44757C17.0475 6.44757 17.0939 6.45184 17.138 6.45887C17.3131 6.48679 17.4527 6.5582 17.4919 6.57822L17.5007 6.58265L18.25 6.93859V3.64665V3.15101Z" fill="#28b463"/>
                    <path opacity="0.5" d="M12 5.21395C11.6658 5.15047 10.9426 5.05264 10.2823 4.87544C8.9381 4.51475 8.04921 3.76429 7 3.48742C6.11349 3.25349 4.95877 3.13488 3.9824 3.07487C2.8863 3.0075 2 3.89961 2 4.99778V16.1436C2 17.2545 2.90605 18.1534 4.01486 18.2228C4.98428 18.2834 6.12329 18.402 7 18.6333C7.48596 18.7616 8.21615 19.0645 8.87295 19.3592C9.87752 19.81 10.9247 20.1556 12 20.3926V5.21395Z" fill="#52be80"/>
                    <path d="M4.27257 12.8183C4.37303 12.4164 4.78023 12.1721 5.18208 12.2726L9.18208 13.2726C9.58393 13.373 9.82825 13.7802 9.72778 14.1821C9.62732 14.5839 9.22012 14.8282 8.81828 14.7278L4.81828 13.7278C4.41643 13.6273 4.17211 13.2201 4.27257 12.8183Z" fill="#1d8348"/>
                    <path d="M5.18208 8.27257C4.78023 8.17211 4.37303 8.41643 4.27257 8.81828C4.17211 9.22012 4.41643 9.62732 4.81828 9.72778L8.81828 10.7278C9.22012 10.8282 9.62732 10.5839 9.72778 10.1821C9.82825 9.78023 9.58393 9.37303 9.18208 9.27257L5.18208 8.27257Z" fill="#148f77"/>
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
                  <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/productExecution">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224Z" fill="#2ecc71"/>
                      <path d="M15.5227 12C15.5227 13.6569 14.1694 15 12.4999 15C10.8304 15 9.47705 13.6569 9.47705 12C9.47705 10.3431 10.8304 9 12.4999 9C14.1694 9 15.5227 10.3431 15.5227 12Z" fill="#2ecc71"/>
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
              <li className="flex items-center text-gray-900 font-bold  ">
                <span
                  className={`transition-all  duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  INVENTORY 
                </span>
              </li>
                 <li>
                  <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/inventory">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.42229 20.6181C10.1779 21.5395 11.0557 22.0001 12 22.0001V12.0001L2.63802 7.07275C2.62423 7.09491 2.6107 7.11727 2.5974 7.13986C2 8.15436 2 9.41678 2 11.9416V12.0586C2 14.5834 2 15.8459 2.5974 16.8604C3.19479 17.8749 4.27063 18.4395 6.42229 19.5686L8.42229 20.6181Z" fill="#52be80"/>
                      <path opacity="0.7" d="M17.5774 4.43152L15.5774 3.38197C13.8218 2.46066 12.944 2 11.9997 2C11.0554 2 10.1776 2.46066 8.42197 3.38197L6.42197 4.43152C4.31821 5.53552 3.24291 6.09982 2.6377 7.07264L11.9997 12L21.3617 7.07264C20.7564 6.09982 19.6811 5.53552 17.5774 4.43152Z" fill="#58d68d"/>
                      <path opacity="0.5" d="M21.4026 7.13986C21.3893 7.11727 21.3758 7.09491 21.362 7.07275L12 12.0001V22.0001C12.9443 22.0001 13.8221 21.5395 15.5777 20.6181L17.5777 19.5686C19.7294 18.4395 20.8052 17.8749 21.4026 16.8604C22 15.8459 22 14.5834 22 12.0586V11.9416C22 9.41678 22 8.15436 21.4026 7.13986Z" fill="#82e0aa"/>
                      <path d="M6.32334 4.48382C6.35617 4.46658 6.38926 4.44922 6.42261 4.43172L7.91614 3.64795L17.0169 8.65338L21.0406 6.64152C21.1783 6.79745 21.298 6.96175 21.4029 7.13994C21.5525 7.39396 21.6646 7.66352 21.7487 7.96455L17.7503 9.96373V13.0002C17.7503 13.4144 17.4145 13.7502 17.0003 13.7502C16.5861 13.7502 16.2503 13.4144 16.2503 13.0002V10.7137L12.7503 12.4637V21.9042C12.4934 21.9682 12.2492 22.0002 12.0003 22.0002C11.7515 22.0002 11.5072 21.9682 11.2503 21.9042V12.4637L2.25195 7.96455C2.33601 7.66352 2.44813 7.39396 2.59771 7.13994C2.70264 6.96175 2.82232 6.79745 2.96001 6.64152L12.0003 11.1617L15.3865 9.46857L6.32334 4.48382Z" fill="#239b56"/>
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
              <li className="flex items-center text-gray-900 font-bold  ">
                <span
                  className={`transition-all  duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  MAINTENANCE
                </span>
              </li>
                 <li>
                  <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/maintenance">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.60379 4.60379C9.33965 2.86793 10.2076 2 11.2861 2C12.3646 2 13.2326 2.86793 14.9684 4.60379L19.3872 9.02256C21.123 10.7584 21.991 11.6263 21.991 12.7049C21.991 13.7834 21.123 14.6513 19.3872 16.3872C17.6513 18.123 16.7834 18.991 15.7049 18.991C14.6263 18.991 13.7584 18.123 12.0226 16.3872L7.60379 11.9684C5.86793 10.2326 5 9.36462 5 8.2861C5 7.20757 5.86793 6.33965 7.60379 4.60379Z" fill="#2ecc71"/>
                      <g opacity="0.5">
                      <path d="M8.34466 12.7093L2.82581 18.2281C2.48337 18.5706 2.31214 18.7418 2.2093 18.9199C1.93023 19.4033 1.93023 19.9988 2.2093 20.4822C2.31214 20.6603 2.48336 20.8315 2.82578 21.1739C3.16823 21.5164 3.33948 21.6876 3.5176 21.7905C4.00097 22.0696 4.5965 22.0696 5.07987 21.7905C5.25799 21.6876 5.42921 21.5164 5.77166 21.174L11.2905 15.6551L8.34466 12.7093Z" fill="#2ecc71"/>
                      <path d="M18.6551 8.29051L19.028 7.91766C19.3704 7.57521 19.5416 7.40399 19.6445 7.22587C19.9236 6.7425 19.9236 6.14696 19.6445 5.66359C19.5416 5.48547 19.3704 5.31425 19.028 4.97181C18.6855 4.62936 18.5143 4.45814 18.3362 4.3553C17.8528 4.07623 17.2573 4.07623 16.7739 4.3553C16.5958 4.45814 16.4246 4.62936 16.0821 4.97181L15.7093 5.34466L18.6551 8.29051Z" fill="#2ecc71"/>
                      </g>
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
              <li className="flex items-center text-gray-900 font-bold ">
                <span
                  className={`transition-all duration-200 bg-emerald-50 px-3 py-2 
                    ${isCollapsed ? "hidden opacity-0 w-0" : "inline opacity-100 w-full"}`}
                >
                  SMART SCHEDULING
                </span>
              </li>
                 <li>
                  <a className="flex items-center gap-x-1 py-2 px-5  text-gray-900 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="/schedule">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.5" d="M21 15.9983V9.99826C21 7.16983 21 5.75562 20.1213 4.87694C19.3529 4.10856 18.175 4.01211 16 4H8C5.82497 4.01211 4.64706 4.10856 3.87868 4.87694C3 5.75562 3 7.16983 3 9.99826V15.9983C3 18.8267 3 20.2409 3.87868 21.1196C4.75736 21.9983 6.17157 21.9983 9 21.9983H15C17.8284 21.9983 19.2426 21.9983 20.1213 21.1196C21 20.2409 21 18.8267 21 15.9983Z" fill="#2ecc71"/>
                    <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" fill="#2ecc71"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 10.5C6.25 10.0858 6.58579 9.75 7 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25H7C6.58579 11.25 6.25 10.9142 6.25 10.5ZM9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H17C17.4142 9.75 17.75 10.0858 17.75 10.5C17.75 10.9142 17.4142 11.25 17 11.25H10.5C10.0858 11.25 9.75 10.9142 9.75 10.5ZM6.25 14C6.25 13.5858 6.58579 13.25 7 13.25H7.5C7.91421 13.25 8.25 13.5858 8.25 14C8.25 14.4142 7.91421 14.75 7.5 14.75H7C6.58579 14.75 6.25 14.4142 6.25 14ZM9.75 14C9.75 13.5858 10.0858 13.25 10.5 13.25H17C17.4142 13.25 17.75 13.5858 17.75 14C17.75 14.4142 17.4142 14.75 17 14.75H10.5C10.0858 14.75 9.75 14.4142 9.75 14ZM6.25 17.5C6.25 17.0858 6.58579 16.75 7 16.75H7.5C7.91421 16.75 8.25 17.0858 8.25 17.5C8.25 17.9142 7.91421 18.25 7.5 18.25H7C6.58579 18.25 6.25 17.9142 6.25 17.5ZM9.75 17.5C9.75 17.0858 10.0858 16.75 10.5 16.75H17C17.4142 16.75 17.75 17.0858 17.75 17.5C17.75 17.9142 17.4142 18.25 17 18.25H10.5C10.0858 18.25 9.75 17.9142 9.75 17.5Z" fill="#2ecc71"/>
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
       ) : null}
    </aside>
    </>
  );
};

export default Sidebar;
