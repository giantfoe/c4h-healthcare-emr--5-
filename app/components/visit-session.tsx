"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, Square, Clock, FileText, User, Phone, MapPin, Baby, Heart } from "lucide-react"
import { type Appointment, type Patient, type VisitNote, visitService } from "@/app/lib/supabase"

interface VisitSessionProps {
  appointment: Appointment
  onEndVisit: () => void
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void
}

export function VisitSession({ appointment, onEndVisit, onUpdateAppointment }: VisitSessionProps) {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [visitNotes, setVisitNotes] = useState({
    chief_complaint: "",
    examination_findings: "",
    diagnosis: "",
    treatment_plan: "",
    follow_up_date: "",
    provider_name: "Dr. Sarah Johnson" // Default provider
  })
  const [isEnding, setIsEnding] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true)
      setIsPaused(false)
      startTimeRef.current = Date.now() - pausedTimeRef.current
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current)
        }
      }, 1000)
    }
  }

  const pauseTimer = () => {
    if (isActive && !isPaused) {
      setIsPaused(true)
      pausedTimeRef.current = elapsedTime
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const resumeTimer = () => {
    if (isActive && isPaused) {
      setIsPaused(false)
      startTimeRef.current = Date.now() - pausedTimeRef.current
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Date.now() - startTimeRef.current)
        }
      }, 1000)
    }
  }

  const endVisit = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsEnding(true)
    
    try {
      // Prepare visit data
      const visitData: Omit<VisitNote, "id" | "created_at"> = {
        patient_id: appointment.patient_id,
        visit_date: new Date().toISOString().split('T')[0],
        visit_type: appointment.type,
        chief_complaint: visitNotes.chief_complaint,
        examination_findings: visitNotes.examination_findings,
        diagnosis: visitNotes.diagnosis,
        treatment_plan: visitNotes.treatment_plan,
        follow_up_date: visitNotes.follow_up_date || undefined,
        provider_name: visitNotes.provider_name
      }
      
      // Save visit notes
      await visitService.create(visitData)
      
      // Update appointment status to completed
      await onUpdateAppointment(appointment.id, { status: "completed" })
      
      // Call the end visit handler
      onEndVisit()
    } catch (error) {
      console.error("Error ending visit:", error)
      setIsEnding(false)
    }
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleNotesChange = (field: string, value: string) => {
    setVisitNotes(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const patient = appointment.patient

  return (
    <div className="space-y-4 sm:space-y-6 fade-in px-4 sm:px-0 pb-20 sm:pb-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Top row with back button and title */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onEndVisit} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Visit Session</h1>
            <p className="text-slate-600">{appointment.type}</p>
          </div>
        </div>
        
        {/* Timer and Controls - Responsive Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Timer Display */}
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-slate-600">
              {!isActive ? "Ready to start" : isPaused ? "Paused" : "In progress"}
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {!isActive ? (
              <Button onClick={startTimer} className="primary-btn w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Start Visit
              </Button>
            ) : isPaused ? (
              <Button onClick={resumeTimer} className="primary-btn w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" className="w-full sm:w-auto">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {isActive && (
              <Button 
                onClick={endVisit} 
                variant="destructive"
                disabled={isEnding}
                className="w-full sm:w-auto"
              >
                <Square className="h-4 w-4 mr-2" />
                {isEnding ? "Ending..." : "End Visit"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Information */}
      {patient && (
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-slate-700">
                  {`${patient.first_name[0]}${patient.last_name[0]}`}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{`${patient.first_name} ${patient.last_name}`}</h3>
                <p className="text-slate-600">
                  {patient.status === "pregnant" 
                    ? `${patient.gestational_age} weeks pregnant` 
                    : `Child: ${patient.child_name}`}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{patient.phone}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{patient.address}</span>
              </div>
              {patient.status === "pregnant" && (
                <div className="flex items-center text-sm text-slate-600">
                  <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Risk Level: {patient.risk_level}</span>
                </div>
              )}
              {patient.status === "lactating" && patient.child_name && (
                <div className="flex items-center text-sm text-slate-600">
                  <Baby className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{patient.child_name} ({patient.child_gender})</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visit Notes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Chief Complaint */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Chief Complaint</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What brings the patient in today?"
              value={visitNotes.chief_complaint}
              onChange={(e) => handleNotesChange('chief_complaint', e.target.value)}
              className="min-h-[120px] bg-white border-transparent focus:border-slate-200"
            />
          </CardContent>
        </Card>

        {/* Examination Findings */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Examination Findings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Physical examination findings, vital signs, etc."
              value={visitNotes.examination_findings}
              onChange={(e) => handleNotesChange('examination_findings', e.target.value)}
              className="min-h-[120px] bg-white border-transparent focus:border-slate-200"
            />
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Diagnosis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Primary and secondary diagnoses"
              value={visitNotes.diagnosis}
              onChange={(e) => handleNotesChange('diagnosis', e.target.value)}
              className="min-h-[120px] bg-white border-transparent focus:border-slate-200"
            />
          </CardContent>
        </Card>

        {/* Treatment Plan */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Treatment Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Treatment recommendations, medications, instructions"
              value={visitNotes.treatment_plan}
              onChange={(e) => handleNotesChange('treatment_plan', e.target.value)}
              className="min-h-[120px] bg-white border-transparent focus:border-slate-200"
            />
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Follow-up Date */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Follow-up Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={visitNotes.follow_up_date}
              onChange={(e) => handleNotesChange('follow_up_date', e.target.value)}
              className="w-full p-3 bg-white border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-slate-200"
            />
          </CardContent>
        </Card>

        {/* Provider Name */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Provider</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Provider name"
              value={visitNotes.provider_name}
              onChange={(e) => handleNotesChange('provider_name', e.target.value)}
              className="w-full p-3 bg-white border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-slate-200"
            />
          </CardContent>
        </Card>
      </div>

      {/* Status Indicator */}
      {isActive && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <Badge 
            className={`px-3 py-2 text-xs sm:text-sm font-medium shadow-lg ${
              isPaused 
                ? "bg-slate-100 text-slate-800" 
                : "bg-green-100 text-green-800 animate-pulse"
            }`}
          >
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{isPaused ? "Visit Paused" : "Visit In Progress"}</span>
            <span className="sm:hidden">{isPaused ? "Paused" : "Active"}</span>
          </Badge>
        </div>
      )}
    </div>
  )
}