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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 lg:hidden safe-area-bottom">
      <div className="grid grid-cols-5 gap-1 p-3">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center space-y-1 h-16 rounded-2xl transition-all duration-200 ${
              activeView === item.id
                ? "bg-gradient-to-br from-pink-100 to-purple-100 text-pink-800"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
