const { z } = require("zod");
const { EVENT_STATUS } = require("../constants/eventStatus");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createEventDto>} CreateEventDto
 * @typedef {z.infer<typeof updateEventDto>} UpdateEventDto
 */

const createEventDto = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  coins: z.coerce.number().int().min(0, "Coins must be non-negative"),
  start_time: z.coerce.date({
    invalid_type_error: "Start time must be a valid date",
  }),
  end_time: z.coerce.date({
    invalid_type_error: "End time must be a valid date",
  }),
  end_sign: z.coerce.date({
    invalid_type_error: "End sign must be a valid date",
  }),
});

const updateEventDto = createEventDto.partial().extend({
  status: emptyToUndefined(z.enum(Object.values(EVENT_STATUS))).optional(),
});

const checkInEventDto = z.object({
  event_id: z.coerce.number().int().positive("Event ID must be a positive integer"),
  user_id: z.coerce.number().int().positive("User ID must be a positive integer"),
});

module.exports = {
  createEventDto,
  updateEventDto,
  checkInEventDto,
};
