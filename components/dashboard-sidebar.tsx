"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Activity, CheckCircle, Map, LogOut } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard", exact: true },
    { href: "/admin/active-cases", icon: Activity, label: "Active Cases" },
    { href: "/admin/completed", icon: CheckCircle, label: "Completed Tasks" },
    { href: "/admin/map", icon: Map, label: "Map View" },
  ]

  // ✅ LOGOUT FUNCTIONALITY (only logic added)
  const handleLogout = () => {
    // clear auth data (adjust keys if needed)
    localStorage.removeItem("adminToken")
    localStorage.removeItem("user")

    // redirect to admin login
    router.push("/admin/login")
  }

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-sidebar-primary" />
          <h1 className="text-xl font-bold">RAR-DAR</h1>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/admin"

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* ✅ UI SAME, ONLY FUNCTIONALITY ADDED */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
