import "server-only"

// Built-in Cloudinary sample assets used as placeholders for services that have
// no uploaded image. Calm people + nature picks that fit a mental-health clinic.
// These live on Cloudinary's canonical "demo" cloud (our own cloud has no sample
// assets); real uploads still go to our cloud. Swap public ids freely.
const SAMPLE_CLOUD = "demo"

const SAMPLE_BY_SLUG: Record<string, string> = {
  consult: "samples/people/smiling-man",
  anxiety: "samples/landscapes/nature-mountains",
  meds: "samples/landscapes/beach-boat",
  assess: "samples/people/jazz",
  therapy: "samples/people/kitchen-bar",
  wellness: "samples/landscapes/girl-urban-view",
}

const TRANSFORM = "w_800,h_600,c_fill,q_auto,f_auto"

/** Placeholder image URL for a service slug, from Cloudinary's built-in sample assets. */
export function sampleImageUrl(slug: string): string {
  const publicId = SAMPLE_BY_SLUG[slug] ?? "sample"
  return `https://res.cloudinary.com/${SAMPLE_CLOUD}/image/upload/${TRANSFORM}/${publicId}`
}
