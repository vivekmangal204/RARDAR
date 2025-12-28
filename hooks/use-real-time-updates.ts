"use client"

import { useEffect } from "react"

interface RealtimeUpdateOptions {
  pollInterval?: number
  onUpdate?: (data: any) => void
  onError?: (error: Error) => void
}

export function useRealtimeUpdates(endpoint: string, options: RealtimeUpdateOptions = {}) {
  const { pollInterval = 5000, onUpdate, onError } = options

  // Setup polling for real-time updates
  // In production, replace with WebSocket for true real-time
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(endpoint)
        if (!response.ok) throw new Error("Failed to fetch updates")

        const data = await response.json()
        onUpdate?.(data)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onError?.(err)
        console.error("[RAR-DAR] Real-time update error:", err)
      }
    }

    // Fetch immediately
    fetchUpdates()

    // Setup polling interval
    const intervalId = setInterval(fetchUpdates, pollInterval)

    return () => clearInterval(intervalId)
  }, [endpoint, pollInterval, onUpdate, onError])
}

// WebSocket setup for true real-time updates (future implementation)
export function useWebSocketUpdates(
  url: string,
  options: {
    onMessage?: (data: any) => void
    onError?: (error: Error) => void
    onConnect?: () => void
    onDisconnect?: () => void
  } = {},
) {
  const { onMessage, onError, onConnect, onDisconnect } = options

  useEffect(() => {
    let ws: WebSocket | null = null

    const connect = () => {
      try {
        ws = new WebSocket(url)

        ws.onopen = () => {
          console.log("[RAR-DAR] WebSocket connected")
          onConnect?.()
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            onMessage?.(data)
          } catch (err) {
            console.error("[RAR-DAR] Failed to parse WebSocket message:", err)
          }
        }

        ws.onerror = (event) => {
          const error = new Error("WebSocket error")
          onError?.(error)
          console.error("[RAR-DAR] WebSocket error:", event)
        }

        ws.onclose = () => {
          console.log("[RAR-DAR] WebSocket disconnected")
          onDisconnect?.()
          // Attempt to reconnect after 3 seconds
          setTimeout(() => connect(), 3000)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        onError?.(error)
        console.error("[RAR-DAR] WebSocket connection error:", err)
      }
    }

    connect()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [url, onMessage, onError, onConnect, onDisconnect])
}
