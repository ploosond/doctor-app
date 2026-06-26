import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose"

const visitSchema = new Schema(
  {
    patientRef: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    appointmentRef: { type: Schema.Types.ObjectId, ref: "Appointment" }, // optional link
    visitDate: { type: Date, required: true, default: Date.now },
    notes: { type: String }, // free text — what happened
    diagnosis: { type: String }, // provisional / working dx
    medication: { type: String }, // drug + dosage, free text
    followUpDate: { type: Date },
  },
  { timestamps: true }
)

visitSchema.index({ patientRef: 1, visitDate: -1 })

export type Visit = InferSchemaType<typeof visitSchema> & { _id: mongoose.Types.ObjectId }

export const VisitModel =
  (models.Visit as mongoose.Model<Visit>) ?? model<Visit>("Visit", visitSchema)
