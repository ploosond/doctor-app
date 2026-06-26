// PUBLIC API — the only import surface for the appointments module.

export {
  listAppointments,
  getAppointment,
  visitsForAppointment,
  recentAppointments,
  appointmentStats,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  setStatus,
  setNotes,
} from "./appointments.service"
export type {
  AppointmentStatus,
  AppointmentMode,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentRecord,
  VisitRecord,
} from "./appointments.service"
