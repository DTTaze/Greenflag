import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  deleteEventUserById,
  getEventUsersByEventId,
  getOwnerEvents,
  getUserAvatarById,
} from "@/src/utils/api";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

import UserFilters from "./UserFilters";
import UserList from "./UserList";

export default function CustomerUsers() {
  const { user } = useAuthStore();
  const userInfo = user;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    eventId: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null,
    eventId: null,
    eventUser: null,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchEventUsers = async (eventId) => {
    try {
      const usersResponse = await getEventUsersByEventId(eventId);
      return usersResponse.data;
    } catch (error) {
      console.error(`Error fetching users for event ${eventId}:`, error);
      return [];
    }
  };

  const fetchUserData = async (eventUser) => {
    try {
      const userData = eventUser.User;
      const avatarResponse = await getUserAvatarById(eventUser.user_id);
      const avatarData = avatarResponse.data;

      return {
        id: eventUser.user_id,
        full_name: userData.full_name,
        email: userData.email,
        avatar: avatarData?.avatar_url || "/placeholder-avatar.jpg",
        coins: userData.coins || 0,
        events: [
          {
            id: eventUser.event_id,
            title: eventUser.Event.title,
            status: eventUser.Event.status,
            completion_rate: !eventUser.joined_at
              ? 0
              : eventUser.completed_at
                ? 100
                : 50,
            eventUser: eventUser,
          },
        ],
      };
    } catch (error) {
      console.error(
        `Error fetching user data for user ${eventUser.user_id}:`,
        error,
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventsResponse = await getOwnerEvents();
        const eventsData = eventsResponse.data;
        setEvents(eventsData);

        const allUsers = new Map();
        for (const event of eventsData) {
          const eventUsers = await fetchEventUsers(event.id);

          for (const eventUser of eventUsers) {
            if (!allUsers.has(eventUser.user_id)) {
              const userData = await fetchUserData(eventUser);
              if (userData) {
                allUsers.set(eventUser.user_id, userData);
              }
            } else {
              const existingUser = allUsers.get(eventUser.user_id);
              const userData = await fetchUserData(eventUser);
              if (userData) {
                existingUser.events.push(userData.events[0]);
              }
            }
          }
        }

        setUsers(Array.from(allUsers.values()));
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchData();
    }
  }, [userInfo, refreshTrigger]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      eventId: "",
    });
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveUser = (user, eventId, eventUser) => {
    setDeleteDialog({
      open: true,
      user,
      eventId,
      eventUser,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEventUserById(deleteDialog.eventUser.id);

      setDeleteDialog({
        open: false,
        user: null,
        eventId: null,
        eventUser: null,
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      setError(error.message || "Failed to remove user from event");
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      user: null,
      eventId: null,
      eventUser: null,
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesEvent =
      !filters.eventId ||
      user.events.some((event) => event.id === parseInt(filters.eventId));

    return matchesSearch && matchesEvent;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="customer-content-container">
      <div className="customer-section">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <h2 className="customer-section-title text-2xl font-semibold text-gray-800">
            Event Participants
          </h2>
        </div>

        <UserFilters
          events={events}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <UserList
          users={filteredUsers}
          onRemoveUser={handleRemoveUser}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <Dialog
          open={deleteDialog.open}
          onOpenChange={(isOpen) => !isOpen && handleCloseDeleteDialog()}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Participant</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-sm text-gray-500">
              Are you sure you want to remove {deleteDialog.user?.full_name}{" "}
              from{" "}
              {deleteDialog.user?.events.find(
                (e) => e.id === deleteDialog.eventId,
              )?.title || "this event"}
              ?
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCloseDeleteDialog}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
