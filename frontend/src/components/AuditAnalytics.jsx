import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaClipboardList } from "react-icons/fa";
import Chart from "react-apexcharts";
import useAuditAnalyticsStore from "../stores/useAuditAnalyticsStore";

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative"
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

const AuditAnalytics = () => {
  const { analytics, fetchAnalytics, loading } = useAuditAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) return <p className="text-center text-white">Loading analytics...</p>;
  if (!analytics || !analytics.tasks) return <p className="text-center text-white">No analytics data available.</p>;

  const { tasks = {}, auditCounts = {} } = analytics;

  const totalRequests =
    (tasks.pendingTasks || 0) +
    (tasks.inProgressTasks || 0) +
    (tasks.completedTasks || 0) +
    (tasks.overdueTasks || 0);

  const taskData = [
    { title: "All Requests", value: totalRequests, icon: FaClipboardList, color: "text-purple-400" },
    { title: "Pending", value: tasks.pendingTasks || 0, icon: FaTasks, color: "text-yellow-400" },
    { title: "In Progress", value: tasks.inProgressTasks || 0, icon: FaClock, color: "text-blue-400" },
    { title: "Completed", value: tasks.completedTasks || 0, icon: FaCheckCircle, color: "text-green-400" },
    { title: "Overdue", value: tasks.overdueTasks || 0, icon: FaExclamationTriangle, color: "text-red-400" },
  ];

  const statusLabels = ["Pending", "In Progress", "Completed", "Overdue"];
  const statusCounts = [
    tasks.pendingTasks || 0,
    tasks.inProgressTasks || 0,
    tasks.completedTasks || 0,
    tasks.overdueTasks || 0,
  ];

  return (
    <div className="p-6">
      {/* Task Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {taskData.map(({ title, value, icon, color }) => (
          <AnalyticsCard key={title} title={title} value={value} icon={icon} color={color} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Audit Requests Chart (Bar) */}
        <div className="p-6 rounded-lg bg-white">
          <Chart
            options={{
              chart: { type: "bar", background: "transparent" },
              xaxis: {
                categories: Object.keys(auditCounts),
                labels: { style: { colors: "#000", fontSize: "14px" } },
              },
              yaxis: {
                labels: { style: { colors: "#000", fontSize: "14px" } },
              },
              tooltip: {
                theme: "light",
                style: { fontSize: "14px", colors: ["#000"] },
              },
              title: {
                text: "Audit Requests Per Department",
                style: { color: "#000", fontSize: "16px", fontWeight: "bold" },
              },
              colors: ["#6366F1"],
            }}
            series={[{ name: "Requests", data: Object.values(auditCounts) }]}
            type="bar"
            height={300}
          />
        </div>
        <div className="inset-0 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-black font-semibold mb-2">Task Status Distribution</h3>
          {statusCounts.some((count) => count > 0) ? (
            <Chart
              options={{
                labels: statusLabels,
                colors: ["#FFC107", "#8A2BE2", "#28A745", "#DC3545"],
                dataLabels: {
                  style: { colors: ["#ffffff"] },
                },
                legend: {
                  labels: { colors: "#000" },
                },
                tooltip: { theme: "light" },
              }}
              series={statusCounts}
              type="pie"
              height={300}
            />
          ) : (
            <p className="text-black">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditAnalytics;
