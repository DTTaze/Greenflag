import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptEventHandler,
  adminCheckInHandler,
  adminCheckOutHandler,
  adminDeleteEventHandler,
  adminDeleteParticipantHandler,
  adminCreateEventHandler,
  adminUpdateEventHandler,
  partnerCheckInHandler,
  partnerCheckOutHandler,
  partnerCreateEventHandler,
  partnerDeleteParticipantHandler,
  partnerUpdateEventHandler,
} from "@/src/services/event/eventHandlers";
import {
  CreateEventPayload,
  UpdateEventPayload,
} from "@/src/types/event/event.payload";

import {
  generateEventQrQueryFn,
  getAllEventsQueryFn,
  getEventByIdQueryFn,
  getEventUsersByEventIdQueryFn,
  getEventsSignedByUserIdQueryFn,
  getEventsSignedSelfQueryFn,
  partnerGetMyEventsQueryFn,
} from "./QueryFnsEvent";
import { QueryKeysEvent } from "./QueryKeysEvent";

// --- Query Hooks ---

export const useEventsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysEvent.EVENTS],
    queryFn: getAllEventsQueryFn,
  });
};

export const useEventDetailQuery = (eventId: string) => {
  return useQuery({
    queryKey: [QueryKeysEvent.EVENT_DETAIL, eventId],
    queryFn: () => getEventByIdQueryFn(eventId),
    enabled: !!eventId,
  });
};

export const useSignedEventsSelfQuery = () => {
  return useQuery({
    queryKey: [QueryKeysEvent.SIGNED_EVENTS, "self"],
    queryFn: getEventsSignedSelfQueryFn,
  });
};

export const useSignedEventsUserQuery = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeysEvent.SIGNED_EVENTS, "user", userId],
    queryFn: () => getEventsSignedByUserIdQueryFn(userId),
    enabled: !!userId,
  });
};

export const useEventParticipantsQuery = (eventId: string) => {
  return useQuery({
    queryKey: [QueryKeysEvent.PARTICIPANTS, eventId],
    queryFn: () => getEventUsersByEventIdQueryFn(eventId),
    enabled: !!eventId,
  });
};

export const useEventQrQuery = (eventId: string) => {
  return useQuery({
    queryKey: [QueryKeysEvent.QR, eventId],
    queryFn: () => generateEventQrQueryFn(eventId),
    enabled: !!eventId,
  });
};

export const usePartnerEventsQuery = () => {
  return useQuery({
    queryKey: [QueryKeysEvent.EVENTS, "partner"],
    queryFn: partnerGetMyEventsQueryFn,
  });
};

// --- Mutation Hooks ---

export const useAcceptEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => acceptEventHandler(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.SIGNED_EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS, eventId] });
    },
  });
};

export const usePartnerCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, images }: { payload: CreateEventPayload; images?: File[] }) =>
      partnerCreateEventHandler(payload, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENTS] });
    },
  });
};

export const usePartnerUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, payload, images }: { eventId: string; payload: UpdateEventPayload; images?: File[] }) =>
      partnerUpdateEventHandler(eventId, payload, images),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENT_DETAIL, eventId] });
    },
  });
};

export const usePartnerCheckInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      partnerCheckInHandler(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS, eventId] });
    },
  });
};

export const usePartnerCheckOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      partnerCheckOutHandler(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS, eventId] });
    },
  });
};

export const usePartnerDeleteParticipantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventUserId: string) => partnerDeleteParticipantHandler(eventUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS] });
    },
  });
};

export const useAdminCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, images }: { payload: CreateEventPayload; images?: File[] }) =>
      adminCreateEventHandler(payload, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENTS] });
    },
  });
};

export const useAdminUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, payload, images }: { eventId: string; payload: UpdateEventPayload; images?: File[] }) =>
      adminUpdateEventHandler(eventId, payload, images),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENT_DETAIL, eventId] });
    },
  });
};

export const useAdminCheckInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      adminCheckInHandler(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS, eventId] });
    },
  });
};

export const useAdminCheckOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      adminCheckOutHandler(eventId, userId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS, eventId] });
    },
  });
};

export const useAdminDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => adminDeleteEventHandler(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.EVENTS] });
    },
  });
};

export const useAdminDeleteParticipantMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventUserId: string) => adminDeleteParticipantHandler(eventUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysEvent.PARTICIPANTS] });
    },
  });
};
