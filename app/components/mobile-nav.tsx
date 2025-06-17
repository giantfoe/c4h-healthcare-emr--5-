"use client"

import { Button } from "@/components/ui/button"
import { Home, Users, Calendar, Plus, Activity } from "lucide-react"

interface MobileNavProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function MobileNav({ activeView, setActiveView }: MobileNavProps) {
  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: Home,
    },
    {
      id: "patients",
      label: "Mothers",
      icon: Users,
    },
    {
      id: "new-patient",
      label: "Add",
      icon: Plus,
    },
    {
      id: "appointments",
      label: "Schedule",
      icon: Calendar,
    },
    {
      id: "reports",
      label: "Reports",
      icon: Activity,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden safe-area-pb">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-colors min-w-0 ${
              activeView === item.id
                ? "text-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
