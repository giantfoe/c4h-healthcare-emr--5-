"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  Calendar,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  Bell,
  Settings,
  Heart,
  Baby,
  Scale,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import { PatientList } from "./components/patient-list"
import { AppointmentScheduler } from "./components/appointment-scheduler"
import { PatientForm } from "./components/patient-form"
import { MobileNav } from "./components/mobile-nav"
import { Reports } from "./components/reports"
import { patientService, appointmentService, Patient, Appointment } from "./lib/supabase"

export default function MaternalHealthDashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [patientFilter, setPatientFilter] = useState("all")
  const [isOnline, setIsOnline] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "urgent",
      title: "High-Risk Patient Alert",
      message: "Sarah Johnson requires immediate attention",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "appointment",
      title: "Upcoming Appointment",
      message: "Mary Williams - Antenatal Check in 30 minutes",
      time: "25 min ago",
      read: false,
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      message: "New features available in patient management",
      time: "2 hours ago",
      read: true,
    },
  ])
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    pregnantWomen: 0,
    lactatingMothers: 0,
    highRiskCases: 0,
    todayAppointments: 0,
  })
  const [recentPatients, setRecentPatients] = useState<Patient[]>([])
  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load initial data
    loadDashboardData()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Reload dashboard data when returning to dashboard view
  useEffect(() => {
    if (activeView === "dashboard") {
      loadDashboardData()
    }
  }, [activeView])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setShowSearch(false)
        setShowNotifications(false)
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load patients for statistics
      const patients = await patientService.getAll()
      const pregnantCount = patients.filter((p) => p.status === "pregnant").length
      const lactatingCount = patients.filter((p) => p.status === "lactating").length
      const highRiskCount = patients.filter((p) => p.risk_level === "high").length

      // Load today's appointments
      const today = new Date().toISOString().split("T")[0]
      console.log('Loading appointments for date:', today)
      const appointments = await appointmentService.getByDate(today)
      console.log('Found appointments:', appointments.length, appointments)

      setDashboardStats({
        totalPatients: patients.length,
        pregnantWomen: pregnantCount,
        lactatingMothers: lactatingCount,
        highRiskCases: highRiskCount,
        todayAppointments: appointments.length,
      })
      console.log('Dashboard stats set:', {
        totalPatients: patients.length,
        pregnantWomen: pregnantCount,
        lactatingMothers: lactatingCount,
        highRiskCases: highRiskCount,
        todayAppointments: appointments.length,
      })

      // Set recent patients (last 3)
      setRecentPatients(patients.slice(0, 3))

      // Set today's schedule (next 3 appointments)
      setTodaySchedule(appointments.slice(0, 3))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Good morning,</h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">Dr. Sarah 👋</p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 relative dropdown-container">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(!showSearch)}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
          >
            <Search className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 relative"
          >
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-pink-500 rounded-full border-2 border-white"></span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700" />
          </Button>
          
          {/* Search Dropdown */}
          {showSearch && (
            <div className="absolute top-10 sm:top-12 right-0 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 sm:p-4 z-50">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search patients, appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus:ring-0 p-0 text-sm flex-1 outline-none bg-white"
                    autoFocus
                  />
                </div>
                {searchQuery && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Quick Actions</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveView("patients")
                        setShowSearch(false)
                        setSearchQuery("")
                      }}
                      className="w-full justify-start text-sm"
                    >
                      Search in Patient List
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveView("appointments")
                        setShowSearch(false)
                        setSearchQuery("")
                      }}
                      className="w-full justify-start text-sm"
                    >
                      Search in Appointments
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-10 sm:top-12 right-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      setNotifications(prev => 
                        prev.map(n => 
                          n.id === notification.id ? { ...n, read: true } : n
                        )
                      )
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "urgent" ? "bg-red-500" :
                        notification.type === "appointment" ? "bg-blue-500" :
                        "bg-green-500"
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-slate-900">{notification.title}</div>
                        <div className="text-sm text-slate-600 mt-1">{notification.message}</div>
                        <div className="text-xs text-slate-400 mt-2">{notification.time}</div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute top-10 sm:top-12 right-0 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50">
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  Profile Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  System Preferences
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  Data Export
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  Help & Support
                </Button>
                <div className="border-t border-slate-200 my-2" />
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-slate-600 mr-3" />
            <span className="text-slate-800 font-medium">You're offline - Using cached data</span>
          </div>
        </div>
      )}

      {/* Today's Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="pink-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Users className="h-5 w-5 text-pink-800" />
            </div>
            <TrendingUp className="h-4 w-4 text-pink-800" />
          </div>
          <div className="metric-value text-slate-900">{dashboardStats.pregnantWomen}</div>
          <div className="metric-label text-slate-700">Pregnant Women</div>
          <div className="text-xs text-slate-600 mt-1">Active cases</div>
        </div>

        <div className="purple-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Baby className="h-5 w-5 text-purple-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="metric-value text-purple-900">{dashboardStats.lactatingMothers}</div>
          <div className="metric-label text-purple-700">Lactating Mothers</div>
          <div className="text-xs text-purple-600 mt-1">Under care</div>
        </div>

        <div className="cream-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="metric-value text-blue-900">{dashboardStats.todayAppointments}</div>
          <div className="metric-label text-blue-700">Today's Appointments</div>
          <div className="text-xs text-blue-600 mt-1">Scheduled visits</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="metric-value text-red-900">{dashboardStats.highRiskCases}</div>
          <div className="metric-label text-red-700">High-Risk Cases</div>
          <div className="text-xs text-red-600 mt-1">Requires attention</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="health-card p-4 sm:p-6">
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Button
            onClick={() => setActiveView("new-patient")}
            className="primary-btn h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 text-white"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base font-medium">New Mother</span>
          </Button>
          <Button
            onClick={() => setActiveView("appointments")}
            className="modern-btn h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 text-slate-700 hover:text-slate-900"
          >
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base font-medium">Schedule Visit</span>
          </Button>
          <Button
            onClick={() => setActiveView("patients")}
            className="modern-btn h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 text-slate-700 hover:text-slate-900"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base font-medium">Find Mother</span>
          </Button>
          <Button
            onClick={() => setActiveView("reports")}
            className="modern-btn h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 text-slate-700 hover:text-slate-900"
          >
            <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base font-medium">Health Reports</span>
          </Button>
        </div>
      </div>

      {/* Health Analytics */}
      <div className="health-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="section-title mb-0 text-lg sm:text-xl">Health Analytics</h2>
          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => setActiveView("reports")}>
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-800" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">94%</div>
            <div className="text-xs sm:text-sm text-slate-600">Healthy Pregnancies</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Baby className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">87%</div>
            <div className="text-xs sm:text-sm text-slate-600">Breastfeeding Success</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">2.8kg</div>
            <div className="text-xs sm:text-sm text-slate-600">Avg Birth Weight</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">96%</div>
            <div className="text-xs sm:text-sm text-slate-600">Vaccination Rate</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Patients */}
        <div className="health-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="section-title mb-0 text-lg sm:text-xl">Recent Patients</h2>
            <Button variant="ghost" size="sm" onClick={() => {
              setPatientFilter("all")
              setActiveView("patients")
            }} className="text-slate-600">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentPatients.map((patient, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setActiveView("patients")}
              >
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-slate-700">
                    {patient.first_name?.[0]}
                    {patient.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {patient.status === "pregnant"
                      ? `${patient.gestational_age} weeks pregnant`
                      : `Lactating - ${patient.child_name}`}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge
                    variant={patient.status === "pregnant" ? "default" : "secondary"}
                    className={`text-xs ${
                      patient.status === "pregnant"
                        ? "bg-pink-100 text-pink-700 hover:bg-pink-100"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {patient.status}
                  </Badge>
                  <Badge
                    variant={patient.risk_level === "high" ? "destructive" : "outline"}
                    className={`text-xs ${
                      patient.risk_level === "high"
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {patient.risk_level} risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="health-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="section-title mb-0 text-lg sm:text-xl">Today's Schedule</h2>
            <Button variant="ghost" size="sm" onClick={() => setActiveView("appointments")} className="text-slate-600">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setActiveView("appointments")}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{appointment.appointment_time}</div>
                        <div className="text-xs text-slate-500">{appointment.duration}min</div>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-slate-900">
                          {appointment.patient
                            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                            : "Patient TBD"}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600">{appointment.type}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.priority === "urgent"
                        ? "destructive"
                        : appointment.priority === "normal"
                          ? "secondary"
                          : "outline"
                    }
                    className={`text-xs ${
                      appointment.priority === "urgent"
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : appointment.priority === "normal"
                          ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    {appointment.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No appointments scheduled for today</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-xl"
                  onClick={() => {
                    console.log("Schedule Appointment button clicked!");
                    setActiveView("appointments");
                  }}
                >
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Alerts */}
      {dashboardStats.highRiskCases > 0 && (
        <div className="health-card p-4 sm:p-6 border-l-4 border-l-red-400">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="section-title mb-0 text-lg sm:text-xl text-red-700">Priority Alerts</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-2xl">
              <div>
                <p className="text-sm sm:text-base font-semibold text-red-900">High-Risk Cases Require Attention</p>
                <p className="text-xs sm:text-sm text-red-700">
                  {dashboardStats.highRiskCases} patients need immediate monitoring
                </p>
              </div>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                onClick={() => {
                  setPatientFilter("high-risk")
                  setActiveView("patients")
                }}
              >
                Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20 md:pb-6">
        {activeView === "dashboard" && renderDashboard()}
        {activeView === "patients" && (
          <PatientList 
            onBack={() => {
              setPatientFilter("all")
              setActiveView("dashboard")
            }} 
            initialFilter={patientFilter}
          />
        )}
        {activeView === "appointments" && <AppointmentScheduler onBack={() => setActiveView("dashboard")} />}
        {activeView === "new-patient" && <PatientForm onBack={() => setActiveView("dashboard")} />}
        {activeView === "reports" && <Reports onBack={() => setActiveView("dashboard")} />}
      </div>

      <MobileNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  )
}
