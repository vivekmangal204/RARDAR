"use client"

import { useEffect, useState, useCallback } from "react"
import type { Location } from "@/lib/types"

interface LocationTrackingOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watchPosition?: boolean
}

export function useLocationTracking(options: LocationTrackingOptions = {}) {
  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 0, watchPosition = false } = options

  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)

  // Get current location once
  const getCurrentLocation = useCallback(async () => {
    return new Promise<Location>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          setLocation(loc)
          setLoading(false)
          resolve(loc)
        },
        (err) => {
          const errorMessage = `Geolocation error: ${err.message}`
          setError(errorMessage)
          setLoading(false)
          console.error("[RAR-DAR] Geolocation error:", err)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        },
      )
    })
  }, [enableHighAccuracy, timeout, maximumAge])

  // Watch position for continuous updates
  useEffect(() => {
    if (!watchPosition || !navigator.geolocation) return

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const loc: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }
        setLocation(loc)
        setError(null)
      },
      (err) => {
        const errorMessage = `Geolocation error: ${err.message}`
        setError(errorMessage)
        console.error("[RAR-DAR] Location tracking error:", err)
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      },
    )

    setWatchId(id)

    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id)
      }
    }
  }, [watchPosition, enableHighAccuracy, timeout, maximumAge])

  // Calculate distance between two points
  const getDistance = useCallback((from: Location, to: Location): number => {
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
  }, [])

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    getDistance,
    stopWatching: () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        setWatchId(null)
      }
    },
  }
}
