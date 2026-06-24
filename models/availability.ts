import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose"

const workingHourSchema = new Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, // 0=Sun, 1=Mon…
    start: { type: String, required: true }, // "HH:MM"
    end: { type: String, required: true },   // "HH:MM"
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
)

const availabilitySchema = new Schema(
  {
    _id: { type: String, default: "singleton" },
    workingHours: { type: [workingHourSchema], default: [] },
    slotDurationMins: { type: Number, default: 30 },
    bufferMins: { type: Number, default: 10 },
    blockedDates: { type: [Date], default: [] },
  },
  { timestamps: true }
)

export type Availability = InferSchemaType<typeof availabilitySchema>

export const AvailabilityModel =
  (models.Availability as mongoose.Model<Availability>) ??
  model<Availability>("Availability", availabilitySchema)
