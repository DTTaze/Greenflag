/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { AuthContext } from "@/src/contexts/auth.context";
import { logoutUserApi } from "@/src/utils/api";

export default function CustomerAppBar({
  open,
  drawerWidth,
  handleDrawerToggle,
  userInfo,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const { notify } = useNotification();
  const { auth, setAuth } = React.useContext(AuthContext);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // Clear user data from localStorage first to prevent fetch errors during navigation
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Then call the logout API
      await logoutUserApi();

      // Notify success but don't wait for the animation
      notify("success", "Đăng xuất thành công");
      setAuth({ isAuthenticated: false, user: null });

      // Immediately navigate to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notify("error", "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
      setLoggingOut(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/customer") return "Dashboard";
    if (path === "/customer/profile") return "Profile";
    if (path === "/customer/orders") return "Orders";
    if (path === "/customer/rewards") return "Rewards";
    if (path === "/customer/events") return "Event Management";
    if (path === "/customer/items") return "Item Management";
    if (path === "/customer/users") return "User Management";
    if (path === "/customer/scanner") return "QR Scanner";
    return "Customer Portal";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        borderBottom: "1px solid var(--light-green)",
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "var(--primary-green)" }}
          >
            <MenuIcon />
          </IconButton>

          <Tooltip title="Go to Homepage">
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ mr: 2, color: "var(--primary-green)" }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                color="inherit"
                href="/customer"
                sx={{
                  textDecoration: "none",
                  color: "var(--primary-green)",
                }}
              >
                Home
              </Link>
              <Typography color="var(--primary-green)" fontWeight="600">
                {getPageTitle()}
              </Typography>
            </Breadcrumbs>
          )}

          {isMobile && (
            <Typography color="var(--primary-green)" fontWeight="600">
              {getPageTitle()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              size="medium"
              onClick={handleNotificationsClick}
              sx={{ color: "var(--text-dark)" }}
            >
              <Badge badgeContent={3} color="success">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 },
            }}
          >
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="subtitle2">New Event Created</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tech Conference added to your events
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="subtitle2">
                  User Evaluation Pending
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  5 users need rating for Eco Clean-up event
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="subtitle2">Item Stock Alert</Typography>
                <Typography variant="body2" color="text.secondary">
                  Eco Tote Bags running low (5 remaining)
                </Typography>
              </Box>
            </MenuItem>
          </Menu>

          <Tooltip title="Help">
            <IconButton
              color="inherit"
              size="medium"
              sx={{ color: "var(--text-dark)" }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton onClick={handleProfileClick}>
              <Avatar
                src={userInfo?.avatar_url}
                alt={userInfo?.full_name}
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid var(--light-green)",
                }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                navigate("/customer/profile");
                handleClose();
              }}
            >
              <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleClose();
              }}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <CircularProgress size={20} sx={{ mr: 1 }} color="success" />
              ) : (
                <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
