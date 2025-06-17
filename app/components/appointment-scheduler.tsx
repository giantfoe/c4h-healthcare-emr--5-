"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, MapPin, Phone, Baby, Heart, Clock, User, CalendarDays } from "lucide-react"
import { type Appointment, appointmentService } from "@/app/lib/supabase"
import { NewAppointmentForm } from "./new-appointment-form"
import { VisitSession } from "./visit-session"
import { ViewNotes } from "./view-notes"

interface AppointmentSchedulerProps {
  onBack: () => void
}

export function AppointmentScheduler({ onBack }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showNewAppointment, setShowNewAppointment] = useState<boolean>(false)
  const [activeVisit, setActiveVisit] = useState<Appointment | null>(null)
  const [viewingNotes, setViewingNotes] = useState<Appointment | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [selectedDate])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const dateString = selectedDate.toISOString().split("T")[0]
      const data = await appointmentService.getByDate(dateString)
      setAppointments(data || [])
    } catch (error) {
      console.error("Error loading appointments:", error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const updatedAppointment = await appointmentService.update(id, updates)
      setAppointments(prev => prev.map(apt => (apt.id === id ? updatedAppointment : apt)))
      return updatedAppointment
    } catch (error) {
      console.error("Failed to update appointment:", error)
      throw error
    }
  }

  const handleStartVisit = async (appointment: Appointment) => {
    try {
      const updatedAppointment = await updateAppointment(appointment.id, { status: "in-progress" })
      setActiveVisit(updatedAppointment)
    } catch (error) {
      console.error("Failed to start visit:", error)
    }
  }

  const handleEndVisit = () => {
    setActiveVisit(null)
  }

  const handleViewNotes = (appointment: Appointment) => {
    setViewingNotes(appointment)
  }

  const handleBackFromNotes = () => {
    setViewingNotes(null)
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "in-progress":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500"
      case "normal":
        return "border-l-orange-500"
      case "routine":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next"): void => {
    const newDate = new Date(selectedDate)
    newDate.setDate(direction === "prev" ? newDate.getDate() - 1 : newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const getAppointmentStats = () => {
    const antenatal = appointments.filter(a => 
      a.type.toLowerCase().includes("antenatal")
    ).length
    
    const postnatal = appointments.filter(a => 
      a.type.toLowerCase().includes("postnatal") || 
      a.type.toLowerCase().includes("breastfeeding")
    ).length
    
    const urgent = appointments.filter(a => a.priority === "urgent").length

    return { antenatal, postnatal, urgent }
  }

  if (showNewAppointment) {
    return (
      <NewAppointmentForm
        onBack={() => setShowNewAppointment(false)}
        onSave={async (appointmentData) => {
          try {
            await appointmentService.create(appointmentData)
            await loadAppointments()
            setShowNewAppointment(false)
          } catch (error) {
            console.error("Error creating appointment:", error)
          }
        }}
        selectedDate={selectedDate}
      />
    )
  }

  const stats = getAppointmentStats()

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Maternal Appointments</h1>
            <p className="text-slate-600">{formatDate(selectedDate)}</p>
          </div>
        </div>
        <Button onClick={() => setShowNewAppointment(true)} className="primary-btn">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="health-card p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-center">
            <h3 className="font-semibold text-lg text-slate-900">{formatDate(selectedDate)}</h3>
            <p className="text-sm text-slate-600">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled</p>
          </div>

          <Button variant="ghost" size="icon" onClick={() => navigateDate("next")} className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Appointment Type Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="pink-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Heart className="h-6 w-6 text-pink-800" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.antenatal}</div>
          <div className="text-sm text-slate-700">Antenatal</div>
        </div>

        <div className="purple-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Baby className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.postnatal}</div>
          <div className="text-sm text-purple-700">Postnatal</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/50 rounded-xl">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-900">{stats.urgent}</div>
          <div className="text-sm text-red-700">Urgent</div>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="health-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="space-y-4">
              <div
                className={`health-card p-6 border-l-4 ${getPriorityColor(appointment.priority)} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="text-lg font-bold text-slate-900">{appointment.appointment_time}</div>
                    <div className="text-xs text-slate-500">{appointment.duration}min</div>
                  </div>

                  <Avatar className="h-12 w-12">
                    <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-slate-700">
                      {appointment.patient ? 
                        `${appointment.patient.first_name[0]}${appointment.patient.last_name[0]}` : 
                        <User className="h-6 w-6" />
                      }
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {appointment.patient
                            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                            : "Patient Information Unavailable"}
                        </h3>
                        <p className="text-sm text-slate-600">{appointment.type}</p>
                        {appointment.patient && (
                          <p className="text-xs text-slate-500">
                            {appointment.patient.status === "pregnant"
                              ? `${appointment.patient.gestational_age} weeks pregnant`
                              : `Child: ${appointment.patient.child_name}`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </Badge>
                        {appointment.priority !== "routine" && (
                          <Badge variant="outline" className="text-xs">
                            {appointment.priority}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {appointment.patient && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-3 w-3 mr-2" />
                          <span>{appointment.patient.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{appointment.patient.address}</span>
                        </div>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="p-3 bg-slate-50 rounded-xl mb-4">
                        <p className="text-sm text-slate-700">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {appointment.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => updateAppointment(appointment.id, { status: "confirmed" })}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => alert("Reschedule functionality would open here")}
                          >
                            Reschedule
                          </Button>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <>
                          <Button
                            size="sm"
                            className="flex-1 primary-btn"
                            onClick={() => handleStartVisit(appointment)}
                          >
                            Start Visit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => alert("Reschedule functionality would open here")}
                          >
                            Reschedule
                          </Button>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-xl"
                          onClick={() => handleViewNotes(appointment)}
                        >
                          View Notes
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Inline Visit Session for this appointment */}
              {activeVisit?.id === appointment.id && (
                <div className="ml-4 border-l-2 border-blue-200 pl-4">
                  <VisitSession
                    appointment={activeVisit}
                    onEndVisit={handleEndVisit}
                    onUpdateAppointment={updateAppointment}
                  />
                </div>
              )}
              
              {/* Inline View Notes for this appointment */}
              {viewingNotes?.id === appointment.id && (
                <div className="ml-4 border-l-2 border-green-200 pl-4">
                  <ViewNotes
                    appointment={viewingNotes}
                    onBack={handleBackFromNotes}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {appointments.length === 0 && !loading && (
        <div className="health-card p-12 text-center">
          <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No appointments scheduled</h3>
          <p className="text-slate-600 mb-6">No appointments found for {formatDate(selectedDate)}</p>
          <Button onClick={() => setShowNewAppointment(true)} className="primary-btn">
            <Plus className="h-4 w-4 mr-2" />
            Schedule First Appointment
          </Button>
        </div>
      )}
    </div>
  )
}