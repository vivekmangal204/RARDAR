import type { Location } from "@/lib/types"

/**
 * Calculate distance between two geographic points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(from: Location, to: Location): number {
  const lat1 = (from.latitude * Math.PI) / 180
  const lon1 = (from.longitude * Math.PI) / 180
  const lat2 = (to.latitude * Math.PI) / 180
  const lon2 = (to.longitude * Math.PI) / 180

  const dLat = lat2 - lat1
  const dLon = lon2 - lon1

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  const c = 2 * Math.asin(Math.sqrt(a))
  const radiusOfEarth = 6371 // km
  return radiusOfEarth * c
}

/**
 * Format location coordinates for display
 */
export function formatLocation(location: Location): string {
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
}

/**
 * Get Google Maps URL for a location
 */
export function getGoogleMapsUrl(location: Location): string {
  return `https://maps.google.com/?q=${location.latitude},${location.longitude}`
}

/**
 * Get Apple Maps URL for a location (iOS)
 */
export function getAppleMapsUrl(location: Location): string {
  return `maps://maps.apple.com/?q=${location.latitude},${location.longitude}`
}

/**
 * Estimate ETA based on distance and average speed
 * Returns estimated time in minutes
 */
export function estimateETA(distanceKm: number, avgSpeedKmh = 40): number {
  return Math.round((distanceKm / avgSpeedKmh) * 60)
}

/**
 * Check if a location is within a radius
 */
export function isWithinRadius(center: Location, point: Location, radiusKm: number): boolean {
  const distance = calculateDistance(center, point)
  return distance <= radiusKm
}
