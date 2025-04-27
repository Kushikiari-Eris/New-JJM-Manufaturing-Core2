import React, { useEffect, useState } from 'react';
import useAuditTaskStore from '../stores/auditTaskStore';
import { motion, AnimatePresence } from "framer-motion";

const AuditInProgressTasks = () => {
const { fetchTasks, tasks, addResponseToTask, updateTask } = useAuditTaskStore();
const [loadingIndex, setLoadingIndex] = useState(null);
const [completeTasks, setCompletedTasks] = useState(() => ({}));


const setCompletedAnimation = (taskId) => {
    setCompletedTasks((prev) => ({
        ...prev,
        [taskId]: true,
    }));

    // Remove task from UI after animation
    setTimeout(() => {
        setCompletedTasks((prev) => {
            const updatedTasks = { ...prev };
            delete updatedTasks[taskId];
            return updatedTasks;
        });
    }, 500); // Match transition duration
};



const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8;
const [selectedTask, setSelectedTask] = useState(null);
const [reports, setReports] = useState({});
const [error, setError] = useState("");

useEffect(() => {
    fetchTasks();
}, [fetchTasks]);

const inProgressTasks = tasks.filter((task) => task.status === "In Progress");

const totalPages = Math.ceil(inProgressTasks.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentRequests = inProgressTasks.slice(indexOfFirstItem, indexOfLastItem);

const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};

// Handle report changes for each task
const handleReportChange = (taskIndex, field, value) => {
    setReports((prev) => ({
        ...prev,
        [taskIndex]: {
            ...prev[taskIndex],
            [field]: value
        }
    }));
};

// Convert file to Base64
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Handle submitting report for each task
const handleSubmitReport = async (taskIndex, taskId) => {
    const taskReport = reports[taskIndex] || {};

    // ✅ Require both text and image
    if (!taskReport.text || !taskReport.image) {
        setError(`Task ${taskIndex + 1}: Both text and image are required.`);
        return;
    }

    setLoadingIndex(taskIndex);

    let base64Image = await convertFileToBase64(taskReport.image);

    const formData = {
        text: taskReport.text,
        image: base64Image, // Send image as Base64
    };

    try {
        await addResponseToTask(taskId, formData);

        // ✅ Update UI instantly
        setSelectedTask((prev) => ({
            ...prev,
            responses: {
                ...prev.responses,
                [taskIndex]: formData // Store submitted data
            }
        }));

        setReports((prev) => ({
            ...prev,
            [taskIndex]: { text: "", image: null }
        }));
        setError(""); // Clear error on success
    } catch (error) {
        console.error("Error submitting report:", error);
        setError(error.response?.data?.message || "Failed to submit report");
    }
};


const handleUpdateTask = async (taskId) => {
    try {
        await updateTask(taskId, { status: "Completed" });
        setCompletedAnimation(taskId);
    } catch (error) {
        console.error("Error updating task:", error);
    }
};



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
                                In Progress Tasks
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

            <dialog id="my_modal_2" className="modal">
                <div className="modal-box rounded-lg">
                    {selectedTask ? (
                    <>
                        <h3 className="font-bold text-xl text-gray-800">{selectedTask.department}</h3>
                        <p className="py-2 text-gray-600">
                        <span className="font-semibold">Tasks:</span>
                        </p>

                        <ul className="space-y-4">
                        {selectedTask.task.map((taskItem, index) => (
                            <li key={index} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                            <p className="text-gray-700 font-medium">{taskItem}</p>

                            <div className="mt-3">
                                <h4 className="font-semibold text-sm text-gray-700">Submit Report</h4>

                                {selectedTask.responses && selectedTask.responses[index] ? (
                                <p className="text-green-600 font-medium mt-2">
                                    Report already submitted for this task.
                                </p>
                                ) : (
                                <>
                                    <textarea
                                    className="w-full border border-gray-300 rounded p-2 mt-2 focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Enter report details..."
                                    value={reports[index]?.text || ""}
                                    onChange={(e) => handleReportChange(index, "text", e.target.value)}
                                    required
                                    />

                                    <div className="mt-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="border border-gray-300 rounded px-3 py-1 cursor-pointer file:bg-blue-500 file:text-white file:border-none file:px-4 file:py-1 file:rounded"
                                        onChange={(e) => handleReportChange(index, "image", e.target.files[0])}
                                        required
                                    />
                                    </div>

                                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                                    <button
                                    className="px-4 py-2 rounded mt-3 bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700 transition"
                                    onClick={() => handleSubmitReport(index, selectedTask._id)}
                                    disabled={loadingIndex === index}
                                    >
                                    {loadingIndex === index ? (
                                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                                    ) : (
                                        "Submit Report"
                                    )}
                                    </button>
                                </>
                                )}
                            </div>
                            </li>
                        ))}
                        </ul>
                    </>
                    ) : (
                    <p>Loading task details...</p>
                    )}
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">Close</button>
                </form>
                </dialog>


                <div className="bg-white rounded-lg mt-10">
                    <h2 className="pt-4 px-4 font-bold text-2xl">In Progress Tasks</h2>
                    <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                    {currentRequests.length > 0 ? (
                        currentRequests.map((req) => {
                        const totalTasks = req.task.length || 1;
                        const completedTasks = req.responses?.length || 0;
                        const progress = (completedTasks / totalTasks) * 100;
                        const allReportsSubmitted = completedTasks === totalTasks;

                        return (
                            <motion.div
                                key={req._id}
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }} // Slide out to the right
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`bg-white border border-gray-200 rounded-lg shadow-lg p-6 transition-all duration-700 ${
                                    completeTasks[req._id] ? "opacity-0 translate-x-10 scale-95" : "hover:shadow-xl"
                                }`}
                            >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-semibold text-gray-800 flex items-center">
                                <div className="h-3 w-3 rounded-full bg-blue-500 me-2"></div>
                                {req.department}
                                </span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {allReportsSubmitted ? "Completed" : "In Progress"}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4">{req.description}</p>

                            {/* Task Dates */}
                            <div className="flex justify-between text-gray-500 text-xs mb-4">
                                <div>
                                <span className="font-semibold block">Task Added</span>
                                {new Date(req.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                <span className="font-semibold block">Due Date</span>
                                {new Date(req.scheduledDate).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Task Progress */}
                            <div className="mb-4">
                                <div className="text-sm font-semibold text-gray-700 mb-1 flex justify-between">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
                                <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                    progress === 100 ? "bg-green-500 animate-pulse" : "bg-blue-500"
                                }`}
                                style={{ width: `${progress}%` }}
                                ></div>
                                </div>
                            </div>

                            {/* Task Details */}
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                <div className="p-2 bg-gray-100 rounded-lg text-center">
                                <span className="font-semibold block">Total Tasks</span>
                                {totalTasks}
                                </div>
                                <div className="p-2 bg-gray-100 rounded-lg text-center">
                                <span className="font-semibold block">Completed</span>
                                {completedTasks}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                className="text-blue-500 text-sm font-semibold px-3 py-1 transition hover:bg-blue-100 rounded-lg"
                                onClick={() => {
                                    setSelectedTask(req);
                                    document.getElementById("my_modal_2").showModal();
                                }}
                                >
                                View Task
                                </button>

                                {allReportsSubmitted && (
                                    <button
                                    className={`text-green-600 text-sm font-semibold px-3 py-1 transition hover:bg-green-100 rounded-lg ${
                                        completedTasks[req._id] ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => handleUpdateTask(req._id)}
                                    disabled={completedTasks[req._id]}
                                >
                                    Mark as Complete
                                </button>
                                )}
                            </div>
                            </motion.div>
                        );
                        })
                    ) : (
                        <div className="col-span-4 text-center text-gray-500 p-4">No tasks found</div>
                    )}
                    </div>
                    </AnimatePresence>



                        {/* Pagination */}
                <div className="flex flex-wrap justify-center items-center rounded-lg space-x-2 py-4 bg-white shadow-sm ">
                <button
                    className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <div className="flex overflow-x-auto gap-1 px-2">
                    {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        currentPage === index + 1 ? "bg-blue-500 text-white" : "text-gray-700  hover:bg-gray-200 "
                        }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                    ))}
                </div>

                <button
                    className={`px-4 py-2 rounded-md text-gray-600  transition-all duration-300 ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 "
                    }`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                </div>
            </div>
        </>
    );
};

export default AuditInProgressTasks;
