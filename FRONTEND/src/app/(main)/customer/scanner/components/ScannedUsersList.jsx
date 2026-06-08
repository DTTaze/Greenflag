import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Calendar, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import React from "react";

export default function ScannedUsersList({ scannedUsers, onRemoveUser }) {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <ShieldCheck
          style={{ marginRight: 8, color: "var(--primary-green)" }}
          size={24}
        />
        Recently Scanned Users
      </Typography>

      {scannedUsers.length > 0 ? (
        <List
          sx={{
            bgcolor: "background.paper",
            overflow: "auto",
            flex: 1,
            maxHeight: 400,
          }}
        >
          {scannedUsers.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveUser(user.id)}
                >
                  <Trash2 size={20} />
                </IconButton>
              }
              sx={{
                mb: 1,
                backgroundColor: "var(--grey-100)",
                borderRadius: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.name} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.email}
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Chip
                        size="small"
                        icon={<Calendar style={{ width: 14, height: 14 }} />}
                        label={user.eventTitle}
                        sx={{ height: 24, fontSize: "0.75rem" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(user.scannedAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 5,
            flex: 1,
          }}
        >
          <UserPlus
            style={{
              width: 40,
              height: 40,
              color: "var(--text-light)",
              marginBottom: 8,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            No users scanned yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start scanning or add users manually
          </Typography>
        </Box>
      )}
    </Box>
  );
}
