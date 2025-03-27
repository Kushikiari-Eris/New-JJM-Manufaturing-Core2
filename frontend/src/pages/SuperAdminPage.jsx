import React from 'react'
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SuperAdminPage = () => {
  return (
    <>
      <motion.div
        className="flex justify-center items-center flex-col text-center px-4 sm:px-6 lg:px-8 mt-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Welcome to JJM Manufacturing Super Admin 
        </h2>
      </motion.div>

      <motion.div
        className="flex justify-center items-center mt-20 mb-20"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Manufacturing Operation",
              description: "This module facilitates the execution and tracking of manufacturing workflows, ensuring efficient production, real-time monitoring, and inventory control.",
              link: "/dashboard"
            },
            {
              title: "Audit Management",
              description: "Ensures compliance with industry standards by systematically tracking, reviewing, and analyzing manufacturing processes while generating reports and corrective actions.",
              link: "/auditDashboard"
            },
            {
              title: "Auditor Management",
              description: "The Auditor Module is a key component of the JJM-Manufacturing System, designed to ensure transparency, accuracy, and compliance in inventory, order tracking, and overall system activities.",
              link: "/auditorDashboard"
            }
          ].map((module, index) => (
            <div key={index} className="card bg-base-100 w-96 shadow-sm border hover:shadow-lg">
              <div className="card-body">
                <h2 className="card-title font-bold text-2xl">{module.title}</h2>
                <p>{module.description}</p>
                <div className="mt-5">
                  <Link to={module.link}>
                    <button className="w-full bg-emerald-400 hover:bg-emerald-500 text-white p-3 rounded-lg font-semibold">
                      Go to {module.title} <ArrowRight className="inline h-5 w-5"/>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

export default SuperAdminPage;
