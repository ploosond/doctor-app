// PUBLIC API — the only import surface for the patients module.

export {
  listPatients,
  getPatient,
  countActivePatients,
  listVisitsByPatient,
  latestVisitByPatient,
  createPatient,
  updatePatient,
  softDeletePatient,
  restorePatient,
  setPatientNotes,
  addVisit,
  updateVisit,
  deleteVisit,
} from "./patients.service"
export type { PatientInput, VisitInput, PatientRecord, VisitRecord, LatestVisit, Gender } from "./patients.service"
