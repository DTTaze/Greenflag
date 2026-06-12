import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { eventServices } from "@/src/services/event";
import { EventType } from "@/src/types/event/event.type";

const getEventSchema = (t: any, isEditing: boolean) =>
  z
    .object({
      title: z.string().min(1, t("events.errors.requiredTitle")),
      description: z.string().min(1, t("events.errors.requiredDescription")),
      location: z.string().min(1, t("events.errors.requiredLocation")),
      capacity: z.number({ message: "Vui lòng nhập số lượng tham gia hợp lệ." }).refine((val) => !isNaN(val), "Vui lòng nhập số lượng tham gia hợp lệ.").refine((val) => val >= 1, "Số lượng tham gia tối thiểu là 1."),
      coins: z.number({ message: "Vui lòng nhập số xu thưởng hợp lệ." }).refine((val) => !isNaN(val), "Vui lòng nhập số xu thưởng hợp lệ.").refine((val) => val >= 0, "Xu thưởng không được là số âm."),
      end_sign: z.string().min(1, t("events.errors.requiredEndSign")),
      start_time: z.string().min(1, t("events.errors.requiredStartTime")),
      end_time: z.string().min(1, t("events.errors.requiredEndTime")),
      images: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      const now = new Date();
      const endSignDate = new Date(data.end_sign);
      const startTimeDate = new Date(data.start_time);
      const endTimeDate = new Date(data.end_time);

      // Future checks (only when creating)
      if (!isEditing) {
        if (endSignDate < now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("events.errors.invalidEndSign"),
            path: ["end_sign"],
          });
        }
        if (startTimeDate < now) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("events.errors.invalidStartTime"),
            path: ["start_time"],
          });
        }
      }

      // Logical order checks
      if (endSignDate > startTimeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("events.errors.invalidEndSignBeforeStart"),
          path: ["end_sign"],
        });
      }
      if (endTimeDate <= startTimeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("events.errors.invalidEndTime"),
          path: ["end_time"],
        });
      }
    });

export type EventFormValues = z.infer<ReturnType<typeof getEventSchema>>;

export const useEventForm = (onSuccess?: (createdEvent?: any) => void) => {
  const t = useTranslations("partner");
  const [saving, setSaving] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Image upload states
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const isEditing = editingEventId !== null;

  const eventSchema = useMemo(() => getEventSchema(t, isEditing), [t, isEditing]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      capacity: 50,
      coins: 10,
      end_sign: "",
      start_time: "",
      end_time: "",
      images: [],
    },
  });

  const handleImagesChange = (files: File[]) => {
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedImages(files);
    if (files.length > 0) {
      const newUrl = URL.createObjectURL(files[0]);
      setPreviewUrls([newUrl]);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleRemoveImage = () => {
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  const handleReset = () => {
    form.reset({
      title: "",
      description: "",
      location: "",
      capacity: 50,
      coins: 10,
      end_sign: "",
      start_time: "",
      end_time: "",
      images: [],
    });
    setEditingEventId(null);
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  const formatIsoToDateTimeLocal = (isoString?: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSelectEvent = (event: EventType) => {
    setEditingEventId(event.id);
    form.reset({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      capacity: event.capacity ?? 50,
      coins: event.coins ?? 10,
      end_sign: formatIsoToDateTimeLocal(event.endSign),
      start_time: formatIsoToDateTimeLocal(event.startTime),
      end_time: formatIsoToDateTimeLocal(event.endTime),
      images: event.images || [],
    });
    setSelectedImages([]);
    setPreviewUrls(event.images || []);
  };

  const onSubmit = async (values: EventFormValues) => {
    setSaving(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        capacity: values.capacity,
        coins: values.coins,
        end_sign: new Date(values.end_sign).toISOString(),
        start_time: new Date(values.start_time).toISOString(),
        end_time: new Date(values.end_time).toISOString(),
        images: previewUrls.filter((url) => !url.startsWith("blob:")),
      };

      let createdEvent;
      if (isEditing && editingEventId) {
        await eventServices.partnerUpdateEvent(editingEventId, payload, selectedImages);
        toast.success(t("events.errors.updateSuccess"));
      } else {
        const res = await eventServices.partnerCreateEvent(payload, selectedImages);
        createdEvent = res?.data || res;
        toast.success(t("events.errors.createSuccess"));
      }

      handleReset();
      if (onSuccess) {
        onSuccess(createdEvent);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.response?.data?.message || err.message || (isEditing ? t("events.errors.updateFailed") : t("events.errors.createFailed"));
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    saving,
    editingEventId,
    setEditingEventId,
    selectedImages,
    previewUrls,
    handleImagesChange,
    handleRemoveImage,
    handleReset,
    handleSelectEvent,
  };
};
