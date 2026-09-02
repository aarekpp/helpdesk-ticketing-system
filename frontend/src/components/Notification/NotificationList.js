import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationList = ({ notifications, removeNotification }) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 10000);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);
  return (
    <Snackbar
      open={notifications.length > 0}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={10000}
      sx={{
        zIndex: 10000,
        width: "90%",
        margin: "0 auto",
        left: 0,
        right: 0,
        transform: "none",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
          >
            {notification.message}
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
};

export default NotificationList;
