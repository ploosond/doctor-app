// PUBLIC API — the only import surface for the booking module.

export { getAvailableSlotsForDate, findNextAvailableDate, hasConflict, createBooking } from "./booking.service"
export type { Slot } from "./slots.helper"
export type { BookingPayload, BookingResult } from "./booking.service"
