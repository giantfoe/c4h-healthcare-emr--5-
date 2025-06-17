"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, FileText, Stethoscope, Pill, Clock } from "lucide-react"
import { type Appointment, type VisitNote, visitService, patientService, type Patient } from "@/app/lib/supabase"

interface ViewNotesProps {
  appointment: Appointment
  onBack: () => void
}

export function ViewNotes({ appointment, onBack }: ViewNotesProps) {
  const [visitNotes, setVisitNotes] = useState<VisitNote[]>([])
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch both visit notes and patient data
        const [notes, patientData] = await Promise.all([
          visitService.getByPatientId(appointment.patient_id),
          patientService.getById(appointment.patient_id)
        ])
        setVisitNotes(notes)
        setPatient(patientData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [appointment.patient_id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading visit notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visit Notes</h2>
            <p className="text-gray-600">
              {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading patient...'}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {visitNotes.length} {visitNotes.length === 1 ? 'Visit' : 'Visits'}
        </Badge>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2">
                {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <span className="ml-2">
                {patient?.date_of_birth ? formatDate(patient.date_of_birth) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="ml-2">{patient?.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2 capitalize">{patient?.status || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Risk Level:</span>
              <span className={`ml-2 capitalize ${
                patient?.risk_level === 'high' ? 'text-red-600' :
                patient?.risk_level === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {patient?.risk_level || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Address:</span>
              <span className="ml-2">{patient?.address || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visit Notes */}
      {visitNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Visit Notes Found</h3>
              <p className="text-gray-600">
                No visit notes have been recorded for this patient yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visitNotes.map((note, index) => (
            <Card key={note.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline">{note.visit_type}</Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(note.visit_date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(note.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-auto max-h-96">
                  <div className="space-y-6">
                    {/* Chief Complaint */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <h4 className="font-semibold text-gray-900">Chief Complaint</h4>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note.chief_complaint || 'No chief complaint recorded'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Examination Findings */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Stethoscope className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Examination Findings</h4>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note.examination_findings || 'No examination findings recorded'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Diagnosis */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Diagnosis</h4>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note.diagnosis || 'No diagnosis recorded'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Treatment Plan */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Pill className="h-4 w-4 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Treatment Plan</h4>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">
                          {note.treatment_plan || 'No treatment plan recorded'}
                        </p>
                      </div>
                    </div>

                    {/* Follow-up Date & Provider */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {note.follow_up_date && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Follow-up Date</h4>
                          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                            <p className="text-yellow-800">{formatDate(note.follow_up_date)}</p>
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Provider</h4>
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                          <p className="text-blue-800">{note.provider_name || 'Unknown Provider'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}