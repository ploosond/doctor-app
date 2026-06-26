import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose"

const appointmentSchema = new Schema(
  {
    patientRef: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    service: { type: String, required: true }, // service slug (DB-driven via ServiceModel)
    mode: { type: String, enum: ["in_person", "video"], default: "in_person" },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled", "no_show"],
      default: "requested",
    },
    notes: { type: String }, // admin-only
  },
  { timestamps: true }
)

appointmentSchema.index({ slotStart: 1, status: 1 })
appointmentSchema.index({ patientRef: 1 })

export type Appointment = InferSchemaType<typeof appointmentSchema> & {
  _id: mongoose.Types.ObjectId
}

export const AppointmentModel =
  (models.Appointment as mongoose.Model<Appointment>) ??
  model<Appointment>("Appointment", appointmentSchema)
