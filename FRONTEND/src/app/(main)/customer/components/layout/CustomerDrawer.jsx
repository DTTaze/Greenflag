import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  Badge,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EventIcon from "@mui/icons-material/Event";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/customer",
  },
  {
    text: "Events",
    icon: <EventIcon />,
    path: "/customer/events",
  },
  {
    text: "Items",
    icon: <InventoryIcon />,
    path: "/customer/items",
  },
  {
    text: "Users",
    icon: <GroupsIcon />,
    path: "/customer/users",
  },
  {
    text: "QR Scanner",
    icon: <QrCodeScannerIcon />,
    path: "/customer/scanner",
  },
  {
    text: "Profile",
    icon: <PersonIcon />,
    path: "/customer/profile",
  },
  {
    text: "Orders",
    icon: <ShoppingCartIcon />,
    path: "/customer/orders",
  },
  // {
  //   text: "Rewards",
  //   icon: <CardGiftcardIcon />,
  //   path: "/customer/rewards",
  // },
];

// Helper to always get a number from coins
function getAmount(val) {
  if (val == null) return 0;
  if (typeof val === "object") return val.amount || 0;
  return val;
}

export default function CustomerDrawer({
  drawerWidth,
  open,
  handleDrawerToggle,
  userInfo,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const drawerContent = (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          gap: 2,
          backgroundColor: "var(--primary-green)",
          color: "white",
          marginTop: "64px",
        }}
      >
        <Avatar
          src={userInfo?.avatar_url}
          alt={userInfo?.full_name}
          sx={{ width: 40, height: 40, border: "2px solid white" }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="white">
            {userInfo?.full_name || "Customer"}
          </Typography>
          <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
            {getAmount(userInfo?.coins)} Coins
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ padding: "8px" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItemButton
                  selected={isActive}
                  onClick={() => {
                    navigate(item.path);
                    handleDrawerToggle();
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: "var(--light-green)",
                      color: "var(--primary-green)",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "var(--light-green)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 50, 0.08)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "var(--primary-green)" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid var(--light-green)",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.05)",
          paddingTop: 0,
        },
        zIndex: 1200,
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
