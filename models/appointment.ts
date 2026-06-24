import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose"

const SERVICE_SLUGS = ["consult", "anxiety", "meds", "assess", "therapy", "wellness"] as const

const appointmentSchema = new Schema(
  {
    patientRef: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    service: { type: String, enum: SERVICE_SLUGS, required: true },
    mode: { type: String, enum: ["in_person", "video"], default: "in_person" },
    slotStart: { type: Date, required: true },
    slotEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled", "no_show"],
      default: "requested",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    fee: { type: Number },
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
