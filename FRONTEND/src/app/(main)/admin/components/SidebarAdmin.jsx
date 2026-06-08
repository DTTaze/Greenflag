import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";

import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RedeemIcon from "@mui/icons-material/Redeem";
import EventIcon from "@mui/icons-material/Event";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuIcon from "@mui/icons-material/Menu";

export default function TemporaryDrawer({ userInfo }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  const menuSections = [
    {
      label: "Quản lý chính",
      items: [
        {
          text: "Trang chủ",
          icon: <DashboardIcon />,
          path: "/admin",
        },
        {
          text: "Quản lý người dùng",
          icon: <PeopleIcon />,
          path: "/admin/users",
        },
        {
          text: "Quản lý quyền truy cập",
          icon: <SecurityIcon />,
          path: "/admin/rbac",
        },
      ],
    },
    {
      label: "Quản lý nội dung",
      items: [
        {
          text: "Nhiệm vụ",
          icon: <AssignmentIcon />,
          path: "/admin/content/missions",
        },
        {
          text: "Sản phẩm từ đối tác",
          icon: <RedeemIcon />,
          path: "/admin/content/items",
        },
        {
          text: "Sản phẩm trao đổi P2P",
          icon: <ShoppingCartIcon />,
          path: "/admin/content/products",
        },
        {
          text: "Sự kiện",
          icon: <EventIcon />,
          path: "/admin/content/events",
        },
      ],
    },
    {
      label: "Quản lý giao dịch",
      items: [
        {
          text: "Giao dịch",
          icon: <CurrencyExchangeIcon />,
          path: "/admin/transactions",
        },
        {
          text: "Vận chuyển",
          icon: <LocalShippingIcon />,
          path: "/admin/orders",
        },
      ],
    },
    {
      label: "Khác",
      items: [
        {
          text: "Hàng đợi",
          icon: <AddToQueueIcon />,
          path: "/admin/queues",
        },
      ],
    },
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
    setOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="h6" fontWeight={600} color="primary">
          Green Flag Admin
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 1,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: "primary.main",
          }}
          src={userInfo?.avatar_url}
          alt={userInfo?.username}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {userInfo?.full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Box>
      </Box>

      {menuSections.map((section) => (
        <React.Fragment key={section.label}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ px: 3, pt: 2, pb: 1 }}
          >
            {section.label}
          </Typography>
          <List disablePadding>
            {section.items.map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={selected}
                    onClick={() => handleNavigation(item)}
                    sx={{
                      mx: 1,
                      borderRadius: 1,
                      mb: 0.5,
                      "&.Mui-selected": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.12),
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.18),
                        },
                      },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: selected ? "primary.main" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={selected ? 600 : 400}
                          sx={{ color: selected ? "primary.main" : "inherit" }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Divider sx={{ my: 1.5 }} />
        </React.Fragment>
      ))}

      <Divider sx={{ my: 1.5 }} />

      {/* Footer Section with Settings and Logout */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        color="primary"
        onClick={toggleDrawer(true)}
        edge="start"
        sx={{ m: 0 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            border: "none",
            boxShadow: 6,
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </Box>
  );
}
