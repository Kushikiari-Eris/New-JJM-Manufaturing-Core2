import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, PackageCheck, TrendingUp, AlertTriangle, Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  } from "recharts";
import Chart from "react-apexcharts";
import LoadingSpinner from "./LoadingSpinner"
import { FaTasks, FaCheckCircle, FaClock, FaTools, FaChartBar } from "react-icons/fa";
import useExecutionAnalyticsStore from "../stores/useExecutionAnalyticsStore";
import useInventoryAnalyticsStore from "../stores/useInventoryAnalyticsStore";
import  {useMaintenanceAnalyticsStore}  from "../stores/useMaintenanceAnalyticsStore";

const AnalyticsTab = () => {

	const { analytics, fetchAnalytics, loading } = useExecutionAnalyticsStore();
	const { inventoryAnalytics, fetchInventoryAnalytics, loadings } = useInventoryAnalyticsStore();
	const { maintenanceAnalytics, loadingss, fetchMaintenanceAnalytics } = useMaintenanceAnalyticsStore();

	const {
    totalRawMaterials = 0,
    totalFinishProducts = 0,
    materials = [],
    productStockStatus = {}
} = inventoryAnalytics || {};

	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);



	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
		fetchAnalytics()
		fetchInventoryAnalytics()
		fetchMaintenanceAnalytics()
	}, []);

	

	if (loading) return <p className="text-center text-white">Loading analytics...</p>;
	if (!analytics) return <p className="text-center text-white">No analytics data available.</p>;

	const { totalExecutions, statusCounts, assignedMachineCounts, materialUsage } = analytics;

	const taskData = [
		{ title: "Total Executions", value: totalExecutions, icon: FaTasks, color: "text-yellow-400" },
		{ title: "Pending", value: statusCounts.find(s => s._id === "Pending")?.count || 0, icon: FaClock, color: "text-blue-400" },
		{ title: "In Progress", value: statusCounts.find(s => s._id === "In Progress")?.count || 0, icon: FaClock, color: "text-purple-400" },
		{ title: "Completed", value: statusCounts.find(s => s._id === "Completed")?.count || 0, icon: FaCheckCircle, color: "text-green-400" },
	];


	const statusChartOptions = {
		labels: maintenanceAnalytics?.statusCounts.map(({ _id }) => _id) || [],
		chart: { type: "donut" },
		colors: ["#34D399", "#60A5FA", "#FBBF24", "#EF4444"],
	};

	const typeChartOptions = {
		labels: maintenanceAnalytics?.typeCounts.map(({ _id }) => _id) || [],
		chart: { type: "pie" },
		colors: ["#6D28D9", "#22D3EE", "#F59E0B", "#10B981", "#E11D48"],
	};

	if (isLoading) {
		return <div><LoadingSpinner/></div>;
	}

	return (
		<>
		<div className='max-w-8xl mx-auto px-4 sm:px-6 mt-10 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-4'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`₱${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
				
				{taskData.map(({ title, value, icon, color }) => (
					<AnalyticsCard key={title} title={title} value={value} icon={icon} color={color} />
				))}

				<AnalyticsCard
					title="Total Raw Materials"
					value={totalRawMaterials.toLocaleString()}
					icon={PackageCheck}
					color="from-yellow-500 to-orange-700"
				/>
				<AnalyticsCard
					title="Total Finished Products"
					value={analyticsData.products.toLocaleString()}
					icon={TrendingUp}
					color="from-blue-500 to-indigo-700"
				/>

			</div>



	<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

			<motion.div
				className="bg-white rounded-lg p-4 shadow-md"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
				{/* Title with Black Text */}
				<h2 className="text-black text-lg font-semibold text-center mb-4">
					Daily Sales & Revenue Trends
				</h2>

				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
						<YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
						<YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
						<Tooltip />
						<Legend />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#10B981"
							activeDot={{ r: 5 }}
							strokeWidth={2}
							name="Sales"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="#3B82F6"
							activeDot={{ r: 5 }}
							strokeWidth={2}
							name="Revenue"
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>

			
        {/* Machine Assignments */}
        <motion.div
				className="bg-white rounded-lg p-4 shadow-md"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
			<ResponsiveContainer width="100%" height={300}>
				<h3 className="text-lg text-black font-semibold flex justify-center mb-2">Assigned Machine</h3>
				<Chart
					options={{
					chart: { type: "bar", background: "transparent" },
					xaxis: {
						categories: assignedMachineCounts.map(m => m._id),
						labels: { style: { colors: "#000", fontSize: "14px" } },
					},
					yaxis: {
						labels: { style: { colors: "#000", fontSize: "14px" } },
					},
					colors: ["#6366F1"],
					title: {
						style: { color: "#000", fontSize: "16px", fontWeight: "bold" },
					},
					}}
					series={[{ name: "Assignments", data: assignedMachineCounts.map(m => m.count) }]}
					type="bar"
					height={300}
				/>	
		  </ResponsiveContainer>
        </motion.div>

        <motion.div
				className="bg-white rounded-lg p-4 shadow-md"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
				<h3 className="text-lg text-black flex justify-center font-semibold mb-2">Material Usage</h3>

				{materialUsage && materialUsage.length > 0 ? (
					<Chart
					options={{
						labels: materialUsage.map(m => m._id || "Unknown Material"),
						colors: ["#FFC107", "#8A2BE2", "#28A745", "#DC3545"],
						legend: {
						labels: { colors: "#000" },
						},
						tooltip: { theme: "light" },
					}}
					series={materialUsage.map(m => m.totalQuantityUsed)}
					type="pie"
					height={300}
					/>
				) : (
					<p className="text-center text-gray-500">No material usage data available.</p>
				)}
		</motion.div>

		
			<motion.div
				className="bg-white rounded-lg p-4 shadow-md"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
				<h3 className="text-lg flex justify-center text-black font-semibold mb-2">Product Execution Status</h3>
			<Chart
				options={{
				labels: statusCounts.map(s => s._id || "Unknown"),
				colors: ["#34D399", "#3B82F6", "#FACC15", "#EF4444", "#A855F7"], // Added new color for "In Progress"
				legend: {
					labels: { colors: "#000" },
				},
				tooltip: { theme: "light" },
				}}
				series={statusCounts.map(s => s.count)}
				type="donut"
				height={300}
			/>
			</motion.div>
		</div>

	</div>
	

	</>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);