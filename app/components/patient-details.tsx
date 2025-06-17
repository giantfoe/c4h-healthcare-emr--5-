"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Baby,
  Edit,
  FileText,
  Activity,
  User,
  Stethoscope,
} from "lucide-react"
import { type Patient, patientService } from "@/lib/supabase"

interface PatientDetailsProps {
  patientId: string
  onBack: () => void
  onEdit: (patient: Patient) => void
}

export function PatientDetails({ patientId, onBack, onEdit }: PatientDetailsProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatient()
  }, [patientId])

  const loadPatient = async () => {
    try {
      setLoading(true)
      const data = await patientService.getById(patientId)
      setPatient(data)
    } catch (error) {
      console.error("Error loading patient:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="health-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded-2xl"></div>
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient Not Found</h1>
            <p className="text-slate-600">The requested patient could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pregnant":
        return "bg-pink-100 text-pink-800 hover:bg-pink-100"
      case "lactating":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-slate-600">{calculateAge(patient.date_of_birth)} years old</p>
          </div>
        </div>
        <Button onClick={() => onEdit(patient)} className="primary-btn">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Patient Overview */}
      <div className="health-card p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-slate-700 text-xl">
              {patient.first_name[0]}
              {patient.last_name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <Badge className={`text-sm ${getStatusBadgeColor(patient.status)}`}>{patient.status}</Badge>
              <Badge className={`text-sm ${getRiskBadgeColor(patient.risk_level)}`}>{patient.risk_level} risk</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-slate-600">
                <Phone className="h-4 w-4 mr-3" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <MapPin className="h-4 w-4 mr-3" />
                <span>{patient.address}</span>
              </div>
              {patient.last_visit && (
                <div className="flex items-center text-slate-600">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Last visit: {new Date(patient.last_visit).toLocaleDateString()}</span>
                </div>
              )}
              {patient.next_appointment && (
                <div className="flex items-center text-blue-600">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Next: {new Date(patient.next_appointment).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Maternal Status Specific Info */}
            {patient.status === "pregnant" && (
              <div className="flex items-center space-x-6 p-4 bg-pink-50 rounded-2xl">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-800 mr-2" />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {patient.gestational_age ? `${patient.gestational_age} weeks` : "Gestational age not recorded"}
                    </div>
                    <div className="text-sm text-slate-700">Gestational Age</div>
                  </div>
                </div>
                {patient.expected_delivery_date && (
                  <div>
                    <div className="font-semibold text-slate-900">
                      {new Date(patient.expected_delivery_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-700">Expected Delivery</div>
                  </div>
                )}
              </div>
            )}

            {patient.status === "lactating" && (
              <div className="flex items-center space-x-6 p-4 bg-purple-50 rounded-2xl">
                <div className="flex items-center">
                  <Baby className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <div className="font-semibold text-purple-900">
                      {patient.child_name || "Child name not recorded"}
                    </div>
                    <div className="text-sm text-purple-700">Child's Name</div>
                  </div>
                </div>
                {patient.breastfeeding_status && (
                  <div>
                    <div className="font-semibold text-purple-900">{patient.breastfeeding_status}</div>
                    <div className="text-sm text-purple-700">Feeding Status</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="health-card p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-2xl p-1">
            <TabsTrigger value="personal" className="rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="medical" className="rounded-xl">
              <Stethoscope className="h-4 w-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="maternal" className="rounded-xl">
              <Heart className="h-4 w-4 mr-2" />
              Maternal
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl">
              <FileText className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Full Name</label>
                  <p className="text-slate-900 font-medium">
                    {patient.first_name} {patient.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                  <p className="text-slate-900">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone Number</label>
                  <p className="text-slate-900">{patient.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Marital Status</label>
                  <p className="text-slate-900">{patient.marital_status || "Not specified"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Emergency Contact</label>
                  <p className="text-slate-900">{patient.emergency_contact}</p>
                  <p className="text-slate-600 text-sm">{patient.emergency_phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Address</label>
                  <p className="text-slate-900">{patient.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">District</label>
                  <p className="text-slate-900">{patient.district}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Education</label>
                  <p className="text-slate-900">{patient.education || "Not specified"}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Blood Type</label>
                  <p className="text-slate-900">{patient.blood_type || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Known Allergies</label>
                  <p className="text-slate-900">{patient.allergies || "None reported"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Current Medications</label>
                  <p className="text-slate-900">{patient.current_medications || "None reported"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Risk Factors</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.risk_factors && patient.risk_factors.length > 0 ? (
                      patient.risk_factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-900">None identified</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Medical History</label>
                  <p className="text-slate-900">{patient.medical_history || "No significant history"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Family History</label>
                  <p className="text-slate-900">{patient.family_history || "No significant family history"}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maternal" className="mt-6 space-y-4">
            {patient.status === "pregnant" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Gestational Age</label>
                    <p className="text-slate-900">
                      {patient.gestational_age ? `${patient.gestational_age} weeks` : "Not recorded"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Expected Delivery Date</label>
                    <p className="text-slate-900">
                      {patient.expected_delivery_date
                        ? new Date(patient.expected_delivery_date).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Pregnancy Number</label>
                    <p className="text-slate-900">{patient.pregnancy_number || "Not specified"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Previous Pregnancies</label>
                    <p className="text-slate-900">{patient.previous_pregnancies || "0"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Previous Deliveries</label>
                    <p className="text-slate-900">{patient.previous_deliveries || "0"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Last Menstrual Period</label>
                    <p className="text-slate-900">
                      {patient.last_menstrual_period
                        ? new Date(patient.last_menstrual_period).toLocaleDateString()
                        : "Not recorded"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {patient.status === "lactating" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Child's Name</label>
                    <p className="text-slate-900">{patient.child_name || "Not recorded"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Child's Gender</label>
                    <p className="text-slate-900">{patient.child_gender || "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Delivery Date</label>
                    <p className="text-slate-900">
                      {patient.delivery_date ? new Date(patient.delivery_date).toLocaleDateString() : "Not recorded"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Birth Weight</label>
                    <p className="text-slate-900">
                      {patient.birth_weight ? `${patient.birth_weight} kg` : "Not recorded"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Current Weight</label>
                    <p className="text-slate-900">
                      {patient.current_child_weight ? `${patient.current_child_weight} kg` : "Not recorded"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Breastfeeding Status</label>
                    <p className="text-slate-900">{patient.breastfeeding_status || "Not specified"}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">Patient registered</span>
                  <span className="text-sm text-slate-600">{new Date(patient.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600">Initial registration completed</p>
              </div>

              {patient.last_visit && (
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">Last visit</span>
                    <span className="text-sm text-slate-600">{new Date(patient.last_visit).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600">Routine checkup completed</p>
                </div>
              )}

              {patient.next_appointment && (
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">Upcoming appointment</span>
                    <span className="text-sm text-slate-600">
                      {new Date(patient.next_appointment).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Scheduled for routine care</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="modern-btn h-16 flex-col space-y-2 text-slate-700">
          <Calendar className="h-5 w-5" />
          <span>Schedule Appointment</span>
        </Button>
        <Button className="modern-btn h-16 flex-col space-y-2 text-slate-700">
          <Activity className="h-5 w-5" />
          <span>Add Visit Notes</span>
        </Button>
        <Button className="modern-btn h-16 flex-col space-y-2 text-slate-700">
          <FileText className="h-5 w-5" />
          <span>Generate Report</span>
        </Button>
      </div>
    </div>
  )
}
