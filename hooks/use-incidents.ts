"use client"

import { useEffect, useState, useCallback } from "react"
import type { Incident } from "@/lib/types"

export function useIncidents(status?: string) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch incidents from API
  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = status ? `/api/incidents?status=${status}` : "/api/incidents"
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch incidents")
      }

      const data = await response.json()
      setIncidents(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("[RAR-DAR] Error fetching incidents:", err)
    } finally {
      setLoading(false)
    }
  }, [status])

  // Initial fetch
  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  // Simulate real-time updates with polling
  // In production, use WebSocket or Server-Sent Events
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchIncidents()
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(pollInterval)
  }, [fetchIncidents])

  const updateIncident = useCallback(async (id: string, updates: Partial<Incident>) => {
    try {
      const response = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update incident")
      }

      const updatedIncident = await response.json()

      // Update local state
      setIncidents((prev) => prev.map((i) => (i.id === id ? updatedIncident : i)))

      return updatedIncident
    } catch (err) {
      console.error("[RAR-DAR] Error updating incident:", err)
      throw err
    }
  }, [])

  return { incidents, loading, error, fetchIncidents, updateIncident }
}
