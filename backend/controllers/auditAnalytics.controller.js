import Task from "../models/auditTask.model.js";
import AuditRequestAdmin from "../models/auditRequestAdmin.model.js";
import AuditRequestCore1 from "../models/auditRequestCore1.model.js";
import AuditRequestCore2 from "../models/auditRequestCore2.model.js";
import AuditRequestFinance from "../models/auditRequestFinance.model.js";
import AuditRequestHr1 from "../models/auditRequestHr1.model.js";
import AuditRequestHr2 from "../models/auditRequestHr2.model.js";
import AuditRequestHr3 from "../models/auditRequestHr3.model.js";
import AuditRequestHr4 from "../models/auditRequestHr4.model.js";
import AuditRequestLogistic1 from "../models/auditRequestLogistic1.model.js";
import AuditRequestLogistic2 from "../models/auditRequestLogistic2.model.js";

export const getAnalytics = async (req, res) => {
  try {
    // Get total count of tasks by status
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({ status: "Overdue" });

    // Get total count of audit requests per department
    const auditCounts = {
      admin: await AuditRequestAdmin.countDocuments(),
      core1: await AuditRequestCore1.countDocuments(),
      core2: await AuditRequestCore2.countDocuments(),
      finance: await AuditRequestFinance.countDocuments(),
      hr1: await AuditRequestHr1.countDocuments(),
      hr2: await AuditRequestHr2.countDocuments(),
      hr3: await AuditRequestHr3.countDocuments(),
      hr4: await AuditRequestHr4.countDocuments(),
      logistic1: await AuditRequestLogistic1.countDocuments(),
      logistic2: await AuditRequestLogistic2.countDocuments(),
    };

    res.status(200).json({
      tasks: { pendingTasks, inProgressTasks, completedTasks, overdueTasks },
      auditCounts,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
