export interface Location {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface Incident {
  id: string
  category: "injured" | "carcass"
  status: "pending" | "dispatched" | "in-progress" | "resolved"
  location: Location
  description: string
  photo?: string
  priority: "low" | "medium" | "high"
  reportedAt: string
  dispatchedAt?: string
  completedAt?: string
  completionProof?: string
  completionNotes?: string
  createdAt: string
  updatedAt?: string
}

export interface Report {
  id: string
  category: "injured" | "carcass"
  location: Location
  description: string
  photo?: string
  timestamp: string
}

export interface RescueTeam {
  id: string
  name: string
  status: "available" | "dispatched" | "on-scene" | "en-route"
  location?: Location
  currentIncidentId?: string
  members: number
  vehicle: string
}

export interface DashboardStats {
  pendingIncidents: number
  activeRescues: number
  completedToday: number
  averageResponseTime: string
}
