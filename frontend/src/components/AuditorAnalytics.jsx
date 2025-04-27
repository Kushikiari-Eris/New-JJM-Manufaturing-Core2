import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import { FaTasks, FaClock, FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import useTasksAnalyticsStore from "../stores/useTasksAnalyticsStore";

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-emerald-400 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-600 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);

const AuditorAnalytics = () => {
  const { statusData, departmentData, fetchAnalytics } = useTasksAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const taskStatusMap = {
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
    Overdue: 0,
  };

  statusData?.forEach((item) => {
    if (taskStatusMap.hasOwnProperty(item._id)) {
      taskStatusMap[item._id] = item.count;
    }
  });

  const statusLabels = Object.keys(taskStatusMap);
  const statusCounts = Object.values(taskStatusMap);
  const departmentLabels = departmentData?.map((item) => item._id) || [];
  const departmentCounts = departmentData?.map((item) => item.count) || [];

  const totalTasks = statusCounts.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="p-6 bg-gray-100 ">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <AnalyticsCard title="Total Tasks" value={totalTasks} icon={FaTasks} color="border-blue-500" />
        <AnalyticsCard title="Pending Tasks" value={taskStatusMap.Pending} icon={FaClock} color="border-yellow-500" />
        <AnalyticsCard title="In Progress" value={taskStatusMap["In Progress"]} icon={FaSpinner} color="border-purple-500" />
        <AnalyticsCard title="Completed Tasks" value={taskStatusMap.Completed} icon={FaCheckCircle} color="border-green-500" />
        <AnalyticsCard title="Overdue Tasks" value={taskStatusMap.Overdue} icon={FaExclamationTriangle} color="border-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Pie Chart - Task Status */}
        <div className=" inset-0 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Task Status Distribution</h3>
          {statusCounts.length > 0 ? (
            <Chart
              options={{
                labels: statusLabels,
                colors: ["#FFC107", "#8A2BE2", "#28A745", "#DC3545"], // Yellow, Purple, Green, Red
                dataLabels: {
                  style: {
                    colors: ["#000000"], // Makes data labels (inside pie chart) black
                  },
                },
                legend: {
                  labels: {
                    colors: "#000000", // Makes legend text black
                  },
                },
                tooltip: {
                  theme: "light", // Ensures tooltips have a light background
                },
              }}
              series={statusCounts}
              type="pie"
              height={300}
            />


          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Bar Chart - Department-wise Tasks */}
        <div className="inset-0 bg-white   p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-900 font-semibold mb-2">Tasks by Department</h3>
          {departmentCounts.length > 0 ? (
            <Chart
              options={{
                chart: { type: "bar" },
                xaxis: { 
                  categories: departmentLabels, 
                  labels: { style: { colors: "#000000" } } // X-axis labels black
                },
                yaxis: { 
                  labels: { style: { colors: "#000000" } } // Y-axis labels black
                },
                colors: ["#6366F1"], // Bar color
                dataLabels: {
                  style: { colors: ["#000000"] }, // Data labels black
                },
                legend: {
                  labels: { colors: "#000000" }, // Legend text black
                },
                tooltip: {
                  theme: "light", // Light background for better visibility
                },
              }}
              series={[{ name: "Tasks", data: departmentCounts }]}
              type="bar"
              height={300}
            />


          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditorAnalytics;
