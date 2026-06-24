import mongoose, { Schema } from "mongoose"

const StepSchema = new Schema(
  { title: { type: String, default: "" }, desc: { type: String, default: "" } },
  { _id: false }
)

const LocaleSchema = new Schema(
  {
    name:     { type: String, default: "" },
    tag:      { type: String, default: "" },
    headline: { type: String, default: "" },
    intro:    { type: String, default: "" },
    duration: { type: String, default: "" },
    format:   { type: String, default: "" },
    price:    { type: String, default: "" },
    followup: { type: String, default: "" },
    included: [{ type: String }],
    steps:    [StepSchema],
  },
  { _id: false }
)

const ServiceSchema = new Schema(
  {
    slug:    { type: String, required: true, unique: true, trim: true },
    image:   { type: String },   // Cloudinary URL — card + hero image
    visible: { type: Boolean, default: true },
    content: {
      en: { type: LocaleSchema, required: true },
      ne: { type: LocaleSchema },
    },
    metaTitle:       { type: String },
    metaDescription: { type: String },
    keywords:        [{ type: String }],
    ogImage:         { type: String },
  },
  { timestamps: true }
)

export const ServiceModel =
  mongoose.models.Service ?? mongoose.model("Service", ServiceSchema)
