import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  deleteEventUserById,
  getEventUsersByEventId,
  getOwnerEvents,
} from "@/src/utils/api";

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
      const userData = eventUser.user || eventUser.User;
      if (!userData) return null;

      const userId = eventUser.userId || eventUser.user_id;
      const eventId = eventUser.eventId || eventUser.event_id;
      const event = eventUser.event || eventUser.Event;

      const avatar =
        userData.avatarUrl || userData.avatar_url || "/placeholder-avatar.jpg";
      const coins =
        userData.coin?.amount !== undefined
          ? userData.coin.amount
          : userData.coins || 0;
      const fullName =
        userData.profile?.fullName ||
        userData.full_name ||
        userData.fullName ||
        userData.username ||
        "";

      return {
        id: userId,
        full_name: fullName,
        email: userData.email,
        avatar: avatar,
        coins: coins,
        events: [
          {
            id: eventId,
            title: event?.title || "",
            status: event?.status || "",
            completion_rate: !(eventUser.joinedAt || eventUser.joined_at)
              ? 0
              : eventUser.completedAt || eventUser.completed_at
                ? 100
                : 50,
            eventUser: eventUser,
          },
        ],
      };
    } catch (error) {
      console.error(
        `Error fetching user data for user ${eventUser.userId || eventUser.user_id}:`,
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
            const userId = eventUser.userId || eventUser.user_id;
            if (!userId) continue;

            if (!allUsers.has(userId)) {
              const userData = await fetchUserData(eventUser);
              if (userData) {
                if (!userData.events[0].title) {
                  userData.events[0].title = event.title;
                }
                if (!userData.events[0].status) {
                  userData.events[0].status = event.status;
                }
                allUsers.set(userId, userData);
              }
            } else {
              const existingUser = allUsers.get(userId);
              const userData = await fetchUserData(eventUser);
              if (userData) {
                if (!userData.events[0].title) {
                  userData.events[0].title = event.title;
                }
                if (!userData.events[0].status) {
                  userData.events[0].status = event.status;
                }
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
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="customer-content-container">
      <div className="customer-section">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
