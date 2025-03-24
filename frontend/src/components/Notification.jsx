import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const socket = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useUserStore();
  const isAudit = user?.role === "audit";
  const navigate = useNavigate();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    

    const handleNewNotification = (data, type = null) => {
      if (typeof data !== "object" || Array.isArray(data)) {
        console.error("Unexpected notification format:", data);
        return;
      }

      setNotifications((prev) => {
        const newNotifications = [];

          if (!isAudit) {
          if (data.overdue > 0) {
            const message = `You have ${data.overdue} overdue maintenance tasks.`;
            if (!prev.some((n) => n.message === message)) {
              newNotifications.push({
                id: `overdue-${Date.now()}`,
                message,
                read: false,
                route: "/maintenance",
              });
            }
          }
          if (data.upcoming > 0) {
            const message = `You have ${data.upcoming} upcoming maintenance tasks.`;
            if (!prev.some((n) => n.message === message)) {
              newNotifications.push({
                id: `upcoming-${Date.now()}`,
                message,
                read: false,
                route: "/maintenance",
              });
            }
          }
        }


      // ✅ Audit Request Notifications (Only for Audit Users)
      if (isAudit && type === "audit") {
        if (data.department && data.description) {
          const message = `New audit request from ${data.department}: ${data.description}`;
          if (!prev.some((n) => n.message === message)) {
            newNotifications.push({
              id: `${Date.now()}`,
              message,
              read: false,
              route: `/audit/${data.department.toLowerCase().replace(/\s+/g, "-")}`,
            });
          }
        }
      }

        // ✅ Low Stock Notifications (For All Users)
        if (!isAudit) {
          if (data.materialName && data.quantity !== undefined) {
            const message = `Low stock alert: "${data.materialName}" has only ${data.quantity} left!`;
            if (!prev.some((n) => n.message === message)) {
              newNotifications.push({ id: `${Date.now()}`, message, read: false, route: "/inventory", });
            }
          }
        }

        const updatedNotifications = [...prev, ...newNotifications];
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
    };

    socket.on("maintenanceNotifications", handleNewNotification);
    socket.on("lowStockNotification", handleNewNotification);
    socket.on("auditAdminRequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditCore1RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditCore2RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditFinanceRequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditHr1RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditHr2RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditHr3RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditHr4RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditLogistic1RequestNotification", (data) => handleNewNotification(data, "audit"))
    socket.on("auditLogistic2RequestNotification", (data) => handleNewNotification(data, "audit"))


    return () => {
      socket.off("maintenanceNotifications", handleNewNotification);
      socket.off("lowStockNotification", handleNewNotification);
      socket.off("auditAdminRequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditCore1RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditCore2RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditFinanceRequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditHr1RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditHr2RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditHr3RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditHr4RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditLogistic1RequestNotification", (data) => handleNewNotification(data, "audit"))
      socket.off("auditLogistic2RequestNotification", (data) => handleNewNotification(data, "audit"))

    };
  }, [socket]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // ✅ Mark a specific notification as read
  const handleMarkAsRead = (id) => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  // ✅ Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => {
      const updatedNotifications = prev.map((notification) => ({
        ...notification,
        read: true,
      }));
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      return updatedNotifications;
    });
  };

  // ✅ Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification) => {
  if (notification.route) {
    navigate(notification.route);
  }
};

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-200 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden border">
          <div className="p-4 border-b font-semibold text-gray-700">
            Notifications
          </div>
          {notifications.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto" >
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-3 text-sm border-b flex justify-between ${
                    notification.read ? "bg-gray-100 text-gray-500" : "bg-white"
                  }`}
                >
                  <button className="text-start" onClick={() => handleNotificationClick(notification)}>
                    {notification.message}
                  </button>
                  {!notification.read && (
                    <button
                      className="text-blue-500 text-xs ml-2"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500 text-center">No notifications</div>
          )}
          <div className="flex">
            <button
              className="w-1/2 py-2 text-blue-500 font-medium hover:bg-gray-100"
              onClick={handleClearAll}
            >
              Clear All
            </button>
            <button
              className="w-1/2 py-2 text-green-500 font-medium hover:bg-gray-100"
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
