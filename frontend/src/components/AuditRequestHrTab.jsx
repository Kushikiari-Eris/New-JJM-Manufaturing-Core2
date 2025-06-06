import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import AuditRequestHr1Table from './AuditRequestHr1Table';
import AuditRequestHr2Table from './AuditRequestHr2Table';
import AuditRequestHr3Table from './AuditRequestHr3Table';
import AuditRequestHr4Table from './AuditRequestHr4Table';

const AuditRequestHrTab = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    
        const tabs = [
            { id: "tab1", title: "Hr 1 Requests" },
            { id: "tab2", title: "Hr 2 Requests" },
            { id: "tab3", title: "Hr 3 Requests" },
            { id: "tab4", title: "Hr 4 Requests" },
        ];
  return (
    <>
    <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
                <a
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 "
                >
                <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
                </a>
            </li>
            <li aria-current="page">
                <div className="flex items-center">
                <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                >
                    <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                    />
                </svg>
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 ">
                    Hr Requests
                </span>
                </div>
            </li>
        </ol>
    </nav>

        <div className="w-full max-w-8xl mx-auto p-4 mt-10">
            {/* Tabs */}
            <div className="flex flex-wrap border bg-gray-100  shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex-1 min-w-[150px] py-3 text-lg font-medium text-center transition-all duration-300 ${
                            activeTab === tab.id
                                ? "border-b-4 border-green-500 text-green-600 bg-white"
                                : "text-gray-600 hover:text-green-500"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title} {/* 👈 Now using custom title */}
                    </button>
                ))}
            </div>

            {/* Tab Content with Smooth Transitions */}
            <div className="p-6 bg-white shadow-lg rounded-b-lg min-h-[200px]">
                <AnimatePresence mode="wait">
                    {activeTab === "tab1" && (
                        <motion.div
                            key="tab1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AuditRequestHr1Table/>
                        </motion.div>
                    )}
                    {activeTab === "tab2" && (
                        <motion.div
                            key="tab2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                           <AuditRequestHr2Table/>
                        </motion.div>
                    )}
                    {activeTab === "tab3" && (
                        <motion.div
                            key="tab3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AuditRequestHr3Table/>
                        </motion.div>
                    )}
                    {activeTab === "tab4" && (
                        <motion.div
                            key="tab4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AuditRequestHr4Table/>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </>
  )
}

export default AuditRequestHrTab