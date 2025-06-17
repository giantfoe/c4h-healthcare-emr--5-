"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, User, Phone, Heart, Baby, AlertTriangle } from "lucide-react"
import { patientService, type Patient } from "@/lib/supabase"

interface PatientFormProps {
  onBack: () => void
}

export function PatientForm({ onBack }: PatientFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    district: "",
    chiefdom: "",
    maritalStatus: "",
    education: "",
    occupation: "",

    // Maternal Status
    status: "", // pregnant or lactating

    // Pregnancy Information
    gestationalAge: "",
    expectedDeliveryDate: "",
    pregnancyNumber: "",
    previousPregnancies: "",
    previousDeliveries: "",
    lastMenstrualPeriod: "",

    // Lactating Information
    deliveryDate: "",
    childName: "",
    childGender: "",
    birthWeight: "",
    currentChildWeight: "",
    breastfeedingStatus: "",

    // Medical History
    bloodType: "",
    allergies: "",
    medicalHistory: "",
    currentMedications: "",
    familyHistory: "",

    // Risk Factors
    riskFactors: [] as string[],

    // Insurance
    insuranceNumber: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      riskFactors: checked ? [...prev.riskFactors, factor] : prev.riskFactors.filter((f) => f !== factor),
    }))
  }

  // Update the nextStep function to include basic validation:
  const nextStep = () => {
    // Basic validation for demo purposes
    if (currentStep === 1 && (!formData.firstName || !formData.lastName)) {
      alert("Please enter first and last name to continue")
      return
    }
    if (currentStep === 2 && (!formData.phone || !formData.emergencyContact)) {
      alert("Please enter phone and emergency contact to continue")
      return
    }
    if (currentStep === 3 && !formData.status) {
      alert("Please select maternal status to continue")
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const [saving, setSaving] = useState(false)

  // Calculate risk level based on form data
  const calculateRiskLevel = (): "low" | "medium" | "high" => {
    let riskScore = 0
    
    // Age-based risk
    if (formData.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
      if (age < 18 || age > 35) riskScore += 2
      else if (age > 30) riskScore += 1
    }
    
    // Pregnancy history risk
    if (formData.previousPregnancies && parseInt(formData.previousPregnancies) > 4) riskScore += 2
    if (formData.gestationalAge && parseInt(formData.gestationalAge) > 35) riskScore += 1
    
    // Risk factors
    riskScore += formData.riskFactors.length
    
    if (riskScore >= 4) return "high"
    if (riskScore >= 2) return "medium"
    return "low"
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      
      // Prepare patient data
      const patientData: Omit<Patient, "id" | "created_at"> = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        phone: formData.phone,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        address: formData.address,
        district: formData.district,
        chiefdom: formData.chiefdom,
        marital_status: formData.maritalStatus,
        education: formData.education,
        occupation: formData.occupation,
        status: formData.status as "pregnant" | "lactating",
        gestational_age: formData.gestationalAge ? parseInt(formData.gestationalAge) : undefined,
        expected_delivery_date: formData.expectedDeliveryDate || undefined,
        pregnancy_number: formData.pregnancyNumber ? parseInt(formData.pregnancyNumber) : undefined,
        previous_pregnancies: formData.previousPregnancies ? parseInt(formData.previousPregnancies) : undefined,
        previous_deliveries: formData.previousDeliveries ? parseInt(formData.previousDeliveries) : undefined,
        last_menstrual_period: formData.lastMenstrualPeriod || undefined,
        delivery_date: formData.deliveryDate || undefined,
        child_name: formData.childName || undefined,
        child_gender: formData.childGender || undefined,
        birth_weight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
        current_child_weight: formData.currentChildWeight ? parseFloat(formData.currentChildWeight) : undefined,
        breastfeeding_status: formData.breastfeedingStatus || undefined,
        blood_type: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
        medical_history: formData.medicalHistory || undefined,
        current_medications: formData.currentMedications || undefined,
        family_history: formData.familyHistory || undefined,
        risk_factors: formData.riskFactors,
        insurance_number: formData.insuranceNumber || undefined,
        risk_level: calculateRiskLevel(),
        last_visit: new Date().toISOString().split('T')[0],
      }
      
      // Save to database
      await patientService.create(patientData)
      
      alert(
        `Successfully registered ${formData.firstName} ${formData.lastName} as a new ${formData.status === "pregnant" ? "pregnant woman" : "lactating mother"}!`
      )
      
      // Clear form and go back
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        emergencyContact: "",
        emergencyPhone: "",
        address: "",
        district: "",
        chiefdom: "",
        maritalStatus: "",
        education: "",
        occupation: "",
        status: "",
        gestationalAge: "",
        expectedDeliveryDate: "",
        pregnancyNumber: "",
        previousPregnancies: "",
        previousDeliveries: "",
        lastMenstrualPeriod: "",
        deliveryDate: "",
        childName: "",
        childGender: "",
        birthWeight: "",
        currentChildWeight: "",
        breastfeedingStatus: "",
        bloodType: "",
        allergies: "",
        medicalHistory: "",
        currentMedications: "",
        familyHistory: "",
        riskFactors: [],
        insuranceNumber: "",
      })
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      console.error("Error saving patient:", error)
      alert("Error saving patient data. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 <= currentStep ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <User className="h-12 w-12 text-pink-800 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p className="text-gray-600">Basic details about the mother</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+232 XX XXX XXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange("maritalStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="education">Education Level</Label>
          <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No formal education</SelectItem>
              <SelectItem value="primary">Primary school</SelectItem>
              <SelectItem value="secondary">Secondary school</SelectItem>
              <SelectItem value="tertiary">University/College</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Phone className="h-12 w-12 text-pink-800 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Contact & Location</h3>
        <p className="text-gray-600">Contact information and address</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
            placeholder="Enter contact name"
          />
        </div>
        <div>
          <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
          <Input
            id="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
            placeholder="+232 XX XXX XXX"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Home Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Enter full address"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="district">District *</Label>
          <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="western-area">Western Area</SelectItem>
              <SelectItem value="northern">Northern Province</SelectItem>
              <SelectItem value="southern">Southern Province</SelectItem>
              <SelectItem value="eastern">Eastern Province</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="chiefdom">Chiefdom</Label>
          <Input
            id="chiefdom"
            value={formData.chiefdom}
            onChange={(e) => handleInputChange("chiefdom", e.target.value)}
            placeholder="Enter chiefdom"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Heart className="h-12 w-12 text-pink-800 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Maternal Status</h3>
        <p className="text-gray-600">Current pregnancy or lactation status</p>
      </div>

      <div>
        <Label htmlFor="status">Current Status *</Label>
        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pregnant">Pregnant</SelectItem>
            <SelectItem value="lactating">Lactating Mother</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.status === "pregnant" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gestationalAge">Gestational Age (weeks)</Label>
              <Input
                id="gestationalAge"
                type="number"
                value={formData.gestationalAge}
                onChange={(e) => handleInputChange("gestationalAge", e.target.value)}
                placeholder="e.g., 28"
              />
            </div>
            <div>
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => handleInputChange("expectedDeliveryDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="pregnancyNumber">Pregnancy Number</Label>
              <Input
                id="pregnancyNumber"
                type="number"
                value={formData.pregnancyNumber}
                onChange={(e) => handleInputChange("pregnancyNumber", e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
            <div>
              <Label htmlFor="previousPregnancies">Previous Pregnancies</Label>
              <Input
                id="previousPregnancies"
                type="number"
                value={formData.previousPregnancies}
                onChange={(e) => handleInputChange("previousPregnancies", e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <Label htmlFor="previousDeliveries">Previous Deliveries</Label>
              <Input
                id="previousDeliveries"
                type="number"
                value={formData.previousDeliveries}
                onChange={(e) => handleInputChange("previousDeliveries", e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lastMenstrualPeriod">Last Menstrual Period</Label>
            <Input
              id="lastMenstrualPeriod"
              type="date"
              value={formData.lastMenstrualPeriod}
              onChange={(e) => handleInputChange("lastMenstrualPeriod", e.target.value)}
            />
          </div>
        </>
      )}

      {formData.status === "lactating" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="childName">Child's Name</Label>
              <Input
                id="childName"
                value={formData.childName}
                onChange={(e) => handleInputChange("childName", e.target.value)}
                placeholder="Enter child's name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="childGender">Child's Gender</Label>
              <Select value={formData.childGender} onValueChange={(value) => handleInputChange("childGender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
              <Input
                id="birthWeight"
                type="number"
                step="0.1"
                value={formData.birthWeight}
                onChange={(e) => handleInputChange("birthWeight", e.target.value)}
                placeholder="e.g., 3.2"
              />
            </div>
            <div>
              <Label htmlFor="currentChildWeight">Current Weight (kg)</Label>
              <Input
                id="currentChildWeight"
                type="number"
                step="0.1"
                value={formData.currentChildWeight}
                onChange={(e) => handleInputChange("currentChildWeight", e.target.value)}
                placeholder="e.g., 5.1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="breastfeedingStatus">Breastfeeding Status</Label>
            <Select
              value={formData.breastfeedingStatus}
              onValueChange={(value) => handleInputChange("breastfeedingStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feeding status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">Exclusive breastfeeding</SelectItem>
                <SelectItem value="mixed">Mixed feeding</SelectItem>
                <SelectItem value="formula">Formula feeding</SelectItem>
                <SelectItem value="stopped">Stopped breastfeeding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <AlertTriangle className="h-12 w-12 text-pink-800 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Risk Assessment</h3>
        <p className="text-gray-600">Identify potential risk factors</p>
      </div>

      <div>
        <Label className="text-base font-medium">Risk Factors (Check all that apply)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            "Age under 18 or over 35",
            "Previous pregnancy complications",
            "Diabetes",
            "High blood pressure",
            "Heart disease",
            "Multiple pregnancies (twins/triplets)",
            "Previous cesarean delivery",
            "Smoking",
            "Alcohol use",
            "Drug use",
            "Mental health issues",
            "Domestic violence",
          ].map((factor) => (
            <div key={factor} className="flex items-center space-x-2">
              <Checkbox
                id={factor}
                checked={formData.riskFactors.includes(factor)}
                onCheckedChange={(checked) => handleRiskFactorChange(factor, checked as boolean)}
              />
              <Label htmlFor={factor} className="text-sm">
                {factor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="familyHistory">Family Medical History</Label>
        <Textarea
          id="familyHistory"
          value={formData.familyHistory}
          onChange={(e) => handleInputChange("familyHistory", e.target.value)}
          placeholder="Any relevant family medical history"
          rows={3}
        />
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Baby className="h-12 w-12 text-pink-800 mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Medical Information</h3>
        <p className="text-gray-600">Health history and current medications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="insuranceNumber">Insurance Number</Label>
          <Input
            id="insuranceNumber"
            value={formData.insuranceNumber}
            onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
            placeholder="Enter insurance number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="allergies">Known Allergies</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => handleInputChange("allergies", e.target.value)}
          placeholder="List any known allergies"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="medicalHistory">Previous Medical History</Label>
        <Textarea
          id="medicalHistory"
          value={formData.medicalHistory}
          onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
          placeholder="Previous medical conditions, surgeries, etc."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          value={formData.currentMedications}
          onChange={(e) => handleInputChange("currentMedications", e.target.value)}
          placeholder="List current medications and dosages"
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Mother Registration</h1>
          <p className="text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="bg-pink-600 hover:bg-pink-700">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Mother"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Notice */}
      <Card className="border-0 shadow-sm bg-pink-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Heart className="h-5 w-5 text-pink-800 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Maternal Health Focus</p>
              <p className="text-sm text-slate-700">
                This form is specifically designed for pregnant women and lactating mothers. All information helps us
                provide the best care for both mother and baby.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
