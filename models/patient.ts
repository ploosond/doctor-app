import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose"

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
    consentGiven: { type: Boolean, default: false },
    consentAt: { type: Date },
    notes: { type: String }, // admin-only
    deletedAt: { type: Date }, // soft-delete
  },
  { timestamps: true }
)

patientSchema.index({ name: "text", phone: 1, email: 1 })

export type Patient = InferSchemaType<typeof patientSchema> & { _id: mongoose.Types.ObjectId }

export const PatientModel =
  (models.Patient as mongoose.Model<Patient>) ?? model<Patient>("Patient", patientSchema)
