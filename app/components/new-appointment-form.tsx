"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, Clock, User } from "lucide-react"
import { type Patient, type Appointment, patientService } from "@/lib/supabase"

interface NewAppointmentFormProps {
  onBack: () => void
  onSave: (appointment: Omit<Appointment, "id" | "created_at">) => Promise<void>
  selectedDate: Date
  preSelectedPatient?: Patient
}

export function NewAppointmentForm({ onBack, onSave, selectedDate, preSelectedPatient }: NewAppointmentFormProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: preSelectedPatient?.id || "",
    appointment_date: selectedDate.toISOString().split("T")[0],
    appointment_time: "09:00",
    type: "",
    priority: "routine" as "routine" | "normal" | "urgent",
    duration: 30,
    notes: "",
  })

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll()
      setPatients(data)
    } catch (error) {
      console.error("Error loading patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const appointmentTypes = [
    { value: "antenatal", label: "Antenatal Check", duration: 45 },
    { value: "postnatal", label: "Postnatal Visit", duration: 30 },
    { value: "emergency", label: "Emergency Check", duration: 60 },
    { value: "breastfeeding", label: "Breastfeeding Support", duration: 30 },
    { value: "family-planning", label: "Family Planning", duration: 30 },
    { value: "vaccination", label: "Child Vaccination", duration: 20 },
    { value: "high-risk", label: "High-Risk Monitoring", duration: 60 },
    { value: "delivery", label: "Pre-delivery Assessment", duration: 60 },
    { value: "growth", label: "Child Growth Monitoring", duration: 30 },
  ]

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (type: string) => {
    const appointmentType = appointmentTypes.find((t) => t.value === type)
    setFormData((prev) => ({
      ...prev,
      type: type, // Store the value, not the label
      duration: appointmentType?.duration || 30,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patient_id || !formData.type) {
      alert("Please select a patient and appointment type")
      return
    }

    try {
      setSaving(true)
      await onSave({
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        type: formData.type,
        status: "pending",
        priority: formData.priority,
        duration: formData.duration,
        notes: formData.notes || undefined,
      })
    } catch (error) {
      console.error("Error saving appointment:", error)
      alert("Error saving appointment. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const selectedPatient = patients.find((p) => p.id === formData.patient_id)

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule New Appointment</h1>
          <p className="text-slate-600">Create a new appointment for {selectedDate.toLocaleDateString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div className="health-card p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-slate-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Patient Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="patient">Select Patient *</Label>
              <Select value={formData.patient_id} onValueChange={(value) => handleInputChange("patient_id", value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading patients...
                    </SelectItem>
                  ) : (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {patient.status === "pregnant"
                                ? `${patient.gestational_age} weeks pregnant`
                                : `Lactating - ${patient.child_name}`}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-700">
                      {selectedPatient.first_name[0]}
                      {selectedPatient.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </p>
                    <p className="text-sm text-slate-600">{selectedPatient.phone}</p>
                    <p className="text-xs text-slate-500">
                      Risk Level: {selectedPatient.risk_level} • {selectedPatient.district}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="health-card p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-slate-600 mr-2" />
            <h3 className="text-lg font-semibold text-slate-900">Appointment Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => handleInputChange("appointment_date", e.target.value)}
                className="h-12 rounded-xl bg-white border-transparent focus:border-slate-200"
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Select
                value={formData.appointment_time}
                onValueChange={(value) => handleInputChange("appointment_time", value)}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{type.label}</span>
                        <span className="text-xs text-slate-500 ml-2">{type.duration}min</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                className="h-12 rounded-xl bg-white border-transparent focus:border-slate-200"
                min="15"
                max="120"
                step="15"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Add any special instructions or notes for this appointment..."
              className="rounded-xl bg-white border-transparent focus:border-slate-200"
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Helper text for disabled state */}
          {(!formData.patient_id || !formData.type) && (
            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {!formData.patient_id && !formData.type 
                ? "Please select a patient and appointment type to continue"
                : !formData.patient_id 
                ? "Please select a patient to continue"
                : "Please select an appointment type to continue"
              }
            </div>
          )}
          
          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl" disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 h-12 rounded-xl transition-all duration-200 ${
                saving || !formData.patient_id || !formData.type
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "primary-btn hover:shadow-lg transform hover:scale-[1.02]"
              }`}
              disabled={saving || !formData.patient_id || !formData.type}
            >
              {saving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
