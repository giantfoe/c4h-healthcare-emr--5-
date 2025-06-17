"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Plus, Phone, MapPin, Calendar, Baby, Heart } from "lucide-react"
import { type Patient, patientService } from "@/lib/supabase"
import { PatientDetails } from "./patient-details"

interface PatientListProps {
  onBack: () => void
  initialFilter?: string
}

export function PatientList({ onBack, initialFilter = "all" }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState(initialFilter)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await patientService.getAll()
      setPatients(data)
    } catch (error) {
      console.error("Error loading patients:", error)
      // Remove the fallback demo data - it's now handled in the service
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)

    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "pregnant") return matchesSearch && patient.status === "pregnant"
    if (selectedFilter === "lactating") return matchesSearch && patient.status === "lactating"
    if (selectedFilter === "high-risk") return matchesSearch && patient.risk_level === "high"

    return matchesSearch
  })

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

  if (selectedPatient) {
    return (
      <PatientDetails
        patientId={selectedPatient}
        onBack={() => setSelectedPatient(null)}
        onEdit={(patient) => {
          // Handle edit functionality
          alert(`Edit functionality for ${patient.first_name} ${patient.last_name} would open here`)
        }}
      />
    )
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
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-slate-900">Mothers & Babies</h1>
            <p className="text-slate-600">{filteredPatients.length} patients found</p>
          </div>
        </div>
        <Button className="primary-btn">
          <Plus className="h-4 w-4 mr-2" />
          Add Mother
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="health-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search mothers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>
          <div className="flex gap-2">
            {[
              { id: "all", label: "All" },
              { id: "pregnant", label: "Pregnant" },
              { id: "lactating", label: "Lactating" },
              { id: "high-risk", label: "High Risk" },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={`rounded-xl ${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="health-card p-6 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-slate-700 text-lg">
                  {patient.first_name[0]}
                  {patient.last_name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-slate-600">{calculateAge(patient.date_of_birth)} years old</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`text-sm ${getStatusBadgeColor(patient.status)}`}>{patient.status}</Badge>
                    <Badge className={`text-sm ${getRiskBadgeColor(patient.risk_level)}`}>
                      {patient.risk_level} risk
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-slate-600">
                    {patient.status === "pregnant" ? (
                      <Heart className="h-4 w-4 mr-3 text-pink-800" />
                    ) : (
                      <Baby className="h-4 w-4 mr-3 text-purple-500" />
                    )}
                    <span className="font-medium">
                      {patient.status === "pregnant"
                        ? `${patient.gestational_age} weeks pregnant`
                        : `Child: ${patient.child_name || "Not specified"}`}
                    </span>
                  </div>

                  <div className="flex items-center text-slate-600">
                    <Phone className="h-4 w-4 mr-3" />
                    <span>{patient.phone}</span>
                  </div>

                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-4 w-4 mr-3" />
                    <span>{patient.address}</span>
                  </div>

                  {/* Health Metrics */}
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-2xl">
                    {patient.status === "pregnant" ? (
                      <>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gestational Age</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {patient.gestational_age ? `${patient.gestational_age} weeks` : "Not recorded"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Due Date</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {patient.expected_delivery_date
                              ? new Date(patient.expected_delivery_date).toLocaleDateString()
                              : "Not set"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Feeding Status</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {patient.breastfeeding_status || "Not recorded"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Child Weight</p>
                          <p className="text-sm font-semibold text-slate-900">
                            {patient.current_child_weight ? `${patient.current_child_weight} kg` : "Not recorded"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Last visit: {patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : "None"}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Next:{" "}
                        {patient.next_appointment
                          ? new Date(patient.next_appointment).toLocaleDateString()
                          : "Not scheduled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPatient(patient.id)
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 primary-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      alert(`Scheduling visit for ${patient.first_name} ${patient.last_name}`)
                    }}
                  >
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="health-card p-12 text-center">
          <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No patients found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm 
              ? `No patients match "${searchTerm}" with the current filter` 
              : selectedFilter === 'high-risk' 
                ? 'No high-risk patients found - this is good news!' 
                : 'Try adjusting your search terms or filters'
            }
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedFilter('all')
              }}
              className="text-pink-600 border-pink-200 hover:bg-pink-50"
            >
              Clear search and filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
