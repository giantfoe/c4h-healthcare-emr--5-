import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for demo mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Create Supabase client only if credentials are provided
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Demo mode flag for components to use
export const isUsingDemoData = isDemoMode || !supabase

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey && supabase)
}

// Legacy export for backward compatibility
export const isSupabaseConfigured_old = !!(supabaseUrl && supabaseKey)

// Types for our database
export interface Patient {
  id: string
  created_at: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  emergency_contact: string
  emergency_phone: string
  address: string
  district: string
  chiefdom?: string
  marital_status?: string
  education?: string
  occupation?: string
  status: "pregnant" | "lactating"
  avatar?: string
  gestational_age?: number
  expected_delivery_date?: string
  pregnancy_number?: number
  previous_pregnancies?: number
  previous_deliveries?: number
  last_menstrual_period?: string
  delivery_date?: string
  child_name?: string
  child_gender?: string
  birth_weight?: number
  current_child_weight?: number
  breastfeeding_status?: string
  blood_type?: string
  allergies?: string
  medical_history?: string
  current_medications?: string
  family_history?: string
  risk_factors?: string[]
  insurance_number?: string
  risk_level: "low" | "medium" | "high"
  last_visit?: string
  next_appointment?: string
  blood_pressure?: string
  weight?: number
  height?: number
  bmi?: number
}

export interface Appointment {
  id: string
  created_at: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  type: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "in-progress"
  priority: "routine" | "normal" | "urgent"
  duration: number
  notes?: string
  patient?: Patient
}

export interface VisitNote {
  id: string
  created_at: string
  patient_id: string
  visit_date: string
  visit_type: string
  chief_complaint: string
  examination_findings: string
  diagnosis: string
  treatment_plan: string
  follow_up_date?: string
  provider_name: string
}

// Comprehensive patient dataset
const comprehensivePatients: Patient[] = [
  // Pregnant Women - Various stages and risk levels
  {
    id: "1",
    created_at: "2025-06-17T00:00:00Z",
    first_name: "Aminata",
    last_name: "Kamara",
    date_of_birth: "1995-03-15",
    phone: "+232 76 123 456",
    emergency_contact: "Mohamed Kamara",
    emergency_phone: "+232 76 123 457",
    address: "15 Kissy Street, Freetown",
    district: "Western Area",
    chiefdom: "Freetown",
    marital_status: "married",
    education: "secondary",
    occupation: "Teacher",
    status: "pregnant",
    gestational_age: 32,
    expected_delivery_date: "2025-08-15",
    pregnancy_number: 2,
    previous_pregnancies: 1,
    previous_deliveries: 1,
    last_menstrual_period: "2024-11-20",
    risk_level: "low",
    last_visit: "2025-06-10",
    next_appointment: "2025-06-24",
    medical_history: "Previous normal delivery",
    current_medications: "Prenatal vitamins, Iron supplements",
    blood_type: "O+",
    blood_pressure: "120/80",
    weight: 68,
    height: 165,
    bmi: 25.0,
    allergies: "None known",
    insurance_number: "SL-2025-001",
  },
  {
    id: "2",
    created_at: "2025-06-17T00:00:00Z",
    first_name: "Fatima",
    last_name: "Bangura",
    date_of_birth: "1999-07-22",
    phone: "+232 78 345 678",
    emergency_contact: "Ibrahim Bangura",
    emergency_phone: "+232 78 345 679",
    address: "23 Kenema Town Center",
    district: "Eastern Province",
    chiefdom: "Kenema",
    marital_status: "married",
    education: "primary",
    occupation: "Market vendor",
    status: "lactating",
    child_name: "Ibrahim",
    child_gender: "male",
    birth_weight: 3.2,
    current_child_weight: 5.2,
    breastfeeding_status: "Exclusive",
    delivery_date: "2024-10-15",
    risk_level: "low",
    last_visit: "2025-06-10",
    next_appointment: "2025-07-02",
    blood_type: "A+",
    blood_pressure: "115/75",
    weight: 58,
    height: 160,
    bmi: 22.7,
    medical_history: "Normal vaginal delivery",
    current_medications: "Multivitamins",
    insurance_number: "SL-2024-002",
  },
  {
    id: "3",
    created_at: "2024-01-03T00:00:00Z",
    first_name: "Adama",
    last_name: "Turay",
    date_of_birth: "1988-11-08",
    phone: "+232 76 567 890",
    emergency_contact: "Salifu Turay",
    emergency_phone: "+232 76 567 891",
    address: "45 Port Loko Central",
    district: "Northern Province",
    chiefdom: "Port Loko",
    marital_status: "married",
    education: "tertiary",
    occupation: "Nurse",
    status: "pregnant",
    gestational_age: 38,
    expected_delivery_date: "2024-02-01",
    pregnancy_number: 3,
    previous_pregnancies: 2,
    previous_deliveries: 2,
    last_menstrual_period: "2023-05-15",
    risk_level: "high",
    last_visit: "2024-01-20",
    next_appointment: "2024-01-27",
    medical_history: "Previous gestational diabetes, hypertension",
    current_medications: "Insulin, Methyldopa, Prenatal vitamins",
    risk_factors: ["Diabetes", "Age over 35", "Hypertension"],
    blood_type: "B+",
    blood_pressure: "145/95",
    weight: 78,
    height: 168,
    bmi: 27.6,
    allergies: "Penicillin",
    insurance_number: "SL-2024-003",
  },
  {
    id: "4",
    created_at: "2024-01-04T00:00:00Z",
    first_name: "Mariama",
    last_name: "Sesay",
    date_of_birth: "2001-05-12",
    phone: "+232 77 234 567",
    emergency_contact: "Amara Sesay",
    emergency_phone: "+232 77 234 568",
    address: "12 Bo Town Center",
    district: "Southern Province",
    chiefdom: "Bo",
    marital_status: "single",
    education: "secondary",
    occupation: "Student",
    status: "pregnant",
    gestational_age: 28,
    expected_delivery_date: "2024-05-20",
    pregnancy_number: 1,
    previous_pregnancies: 0,
    previous_deliveries: 0,
    last_menstrual_period: "2023-09-01",
    risk_level: "medium",
    last_visit: "2024-01-18",
    next_appointment: "2024-02-01",
    medical_history: "Twin pregnancy, first pregnancy",
    current_medications: "Prenatal vitamins, Iron supplements, Folic acid",
    blood_type: "AB+",
    blood_pressure: "125/85",
    weight: 72,
    height: 162,
    bmi: 27.4,
    allergies: "None known",
    insurance_number: "SL-2024-004",
  },
  {
    id: "5",
    created_at: "2024-01-05T00:00:00Z",
    first_name: "Hawa",
    last_name: "Koroma",
    date_of_birth: "1997-09-30",
    phone: "+232 79 456 789",
    emergency_contact: "Sahr Koroma",
    emergency_phone: "+232 79 456 790",
    address: "8 Makeni Central",
    district: "Northern Province",
    chiefdom: "Makeni",
    marital_status: "married",
    education: "primary",
    occupation: "Farmer",
    status: "lactating",
    child_name: "Fatima",
    child_gender: "female",
    birth_weight: 2.9,
    current_child_weight: 3.8,
    breastfeeding_status: "Mixed feeding",
    delivery_date: "2023-12-01",
    risk_level: "low",
    last_visit: "2024-01-16",
    next_appointment: "2024-02-05",
    blood_type: "O-",
    blood_pressure: "110/70",
    weight: 55,
    height: 158,
    bmi: 22.0,
    medical_history: "Normal delivery, low birth weight baby",
    current_medications: "Iron supplements, Vitamin D",
    insurance_number: "SL-2024-005",
  },
  // Additional diverse patients
  {
    id: "6",
    created_at: "2024-01-06T00:00:00Z",
    first_name: "Isata",
    last_name: "Mansaray",
    date_of_birth: "1992-12-03",
    phone: "+232 76 789 012",
    emergency_contact: "Abdul Mansaray",
    emergency_phone: "+232 76 789 013",
    address: "34 Waterloo Road, Freetown",
    district: "Western Area",
    chiefdom: "Waterloo",
    marital_status: "married",
    education: "tertiary",
    occupation: "Accountant",
    status: "pregnant",
    gestational_age: 24,
    expected_delivery_date: "2024-06-10",
    pregnancy_number: 2,
    previous_pregnancies: 1,
    previous_deliveries: 1,
    last_menstrual_period: "2023-10-15",
    risk_level: "low",
    last_visit: "2024-01-22",
    next_appointment: "2024-02-12",
    medical_history: "Previous cesarean section",
    current_medications: "Prenatal vitamins, Calcium",
    blood_type: "A-",
    blood_pressure: "118/78",
    weight: 65,
    height: 163,
    bmi: 24.5,
    allergies: "Latex",
    insurance_number: "SL-2024-006",
  },
  {
    id: "7",
    created_at: "2024-01-07T00:00:00Z",
    first_name: "Kadiatu",
    last_name: "Conteh",
    date_of_birth: "1985-04-18",
    phone: "+232 78 901 234",
    emergency_contact: "Mohamed Conteh",
    emergency_phone: "+232 78 901 235",
    address: "67 Kailahun Town",
    district: "Eastern Province",
    chiefdom: "Kailahun",
    marital_status: "married",
    education: "secondary",
    occupation: "Seamstress",
    status: "pregnant",
    gestational_age: 36,
    expected_delivery_date: "2024-03-05",
    pregnancy_number: 4,
    previous_pregnancies: 3,
    previous_deliveries: 3,
    last_menstrual_period: "2023-06-01",
    risk_level: "medium",
    last_visit: "2024-01-19",
    next_appointment: "2024-01-26",
    medical_history: "Grand multipara, previous postpartum hemorrhage",
    current_medications: "Prenatal vitamins, Iron supplements",
    risk_factors: ["Grand multipara", "Previous PPH"],
    blood_type: "B-",
    blood_pressure: "130/88",
    weight: 70,
    height: 160,
    bmi: 27.3,
    allergies: "None known",
    insurance_number: "SL-2024-007",
  },
  {
    id: "8",
    created_at: "2024-01-08T00:00:00Z",
    first_name: "Memuna",
    last_name: "Jalloh",
    date_of_birth: "2000-08-25",
    phone: "+232 77 345 678",
    emergency_contact: "Amina Jalloh",
    emergency_phone: "+232 77 345 679",
    address: "19 Pujehun District",
    district: "Southern Province",
    chiefdom: "Pujehun",
    marital_status: "single",
    education: "primary",
    occupation: "Domestic worker",
    status: "lactating",
    child_name: "Aisha",
    child_gender: "female",
    birth_weight: 3.5,
    current_child_weight: 4.2,
    breastfeeding_status: "Exclusive",
    delivery_date: "2023-11-20",
    risk_level: "low",
    last_visit: "2024-01-14",
    next_appointment: "2024-02-08",
    blood_type: "O+",
    blood_pressure: "112/72",
    weight: 52,
    height: 155,
    bmi: 21.6,
    medical_history: "Normal delivery, teenage mother",
    current_medications: "Multivitamins, Iron",
    insurance_number: "SL-2024-008",
  },
  {
    id: "9",
    created_at: "2024-01-09T00:00:00Z",
    first_name: "Zainab",
    last_name: "Fofana",
    date_of_birth: "1993-06-14",
    phone: "+232 79 567 890",
    emergency_contact: "Ibrahim Fofana",
    emergency_phone: "+232 79 567 891",
    address: "28 Kono District",
    district: "Eastern Province",
    chiefdom: "Kono",
    marital_status: "married",
    education: "secondary",
    occupation: "Trader",
    status: "pregnant",
    gestational_age: 20,
    expected_delivery_date: "2024-07-15",
    pregnancy_number: 3,
    previous_pregnancies: 2,
    previous_deliveries: 2,
    last_menstrual_period: "2023-11-20",
    risk_level: "low",
    last_visit: "2024-01-21",
    next_appointment: "2024-02-18",
    medical_history: "Two previous normal deliveries",
    current_medications: "Prenatal vitamins, Folic acid",
    blood_type: "A+",
    blood_pressure: "115/75",
    weight: 62,
    height: 161,
    bmi: 23.9,
    allergies: "None known",
    insurance_number: "SL-2024-009",
  },
  {
    id: "10",
    created_at: "2024-01-10T00:00:00Z",
    first_name: "Bintu",
    last_name: "Kargbo",
    date_of_birth: "1996-02-28",
    phone: "+232 76 234 567",
    emergency_contact: "Sorie Kargbo",
    emergency_phone: "+232 76 234 568",
    address: "41 Bombali District",
    district: "Northern Province",
    chiefdom: "Bombali",
    marital_status: "married",
    education: "tertiary",
    occupation: "Social worker",
    status: "lactating",
    child_name: "Mohamed",
    child_gender: "male",
    birth_weight: 3.8,
    current_child_weight: 6.1,
    breastfeeding_status: "Mixed feeding",
    delivery_date: "2023-09-10",
    risk_level: "low",
    last_visit: "2024-01-17",
    next_appointment: "2024-02-14",
    blood_type: "AB-",
    blood_pressure: "108/68",
    weight: 59,
    height: 164,
    bmi: 21.9,
    medical_history: "Normal delivery, exclusive breastfeeding for 4 months",
    current_medications: "Multivitamins",
    insurance_number: "SL-2024-010",
  },
  // Continue with more diverse cases...
  {
    id: "11",
    created_at: "2024-01-11T00:00:00Z",
    first_name: "Salamatu",
    last_name: "Barrie",
    date_of_birth: "1987-10-12",
    phone: "+232 78 456 789",
    emergency_contact: "Alhassan Barrie",
    emergency_phone: "+232 78 456 790",
    address: "52 Moyamba Junction",
    district: "Southern Province",
    chiefdom: "Moyamba",
    marital_status: "married",
    education: "primary",
    occupation: "Petty trader",
    status: "pregnant",
    gestational_age: 16,
    expected_delivery_date: "2024-08-20",
    pregnancy_number: 5,
    previous_pregnancies: 4,
    previous_deliveries: 4,
    last_menstrual_period: "2023-12-15",
    risk_level: "medium",
    last_visit: "2024-01-23",
    next_appointment: "2024-02-20",
    medical_history: "Grand multipara, history of prolonged labor",
    current_medications: "Prenatal vitamins, Iron supplements",
    risk_factors: ["Grand multipara", "Previous prolonged labor"],
    blood_type: "O+",
    blood_pressure: "128/82",
    weight: 74,
    height: 157,
    bmi: 30.0,
    allergies: "Sulfa drugs",
    insurance_number: "SL-2024-011",
  },
  {
    id: "12",
    created_at: "2024-01-12T00:00:00Z",
    first_name: "Rugiatu",
    last_name: "Sankoh",
    date_of_birth: "2002-01-30",
    phone: "+232 77 678 901",
    emergency_contact: "Fatima Sankoh",
    emergency_phone: "+232 77 678 902",
    address: "15 Tonkolili District",
    district: "Northern Province",
    chiefdom: "Tonkolili",
    marital_status: "single",
    education: "secondary",
    occupation: "Student",
    status: "pregnant",
    gestational_age: 12,
    expected_delivery_date: "2024-09-15",
    pregnancy_number: 1,
    previous_pregnancies: 0,
    previous_deliveries: 0,
    last_menstrual_period: "2024-01-01",
    risk_level: "medium",
    last_visit: "2024-01-25",
    next_appointment: "2024-02-22",
    medical_history: "First pregnancy, teenage pregnancy",
    current_medications: "Prenatal vitamins, Folic acid",
    risk_factors: ["Teenage pregnancy", "First pregnancy"],
    blood_type: "A-",
    blood_pressure: "105/65",
    weight: 48,
    height: 159,
    bmi: 19.0,
    allergies: "None known",
    insurance_number: "SL-2024-012",
  },
  // High-risk cases
  {
    id: "13",
    created_at: "2024-01-13T00:00:00Z",
    first_name: "Mabinty",
    last_name: "Kamara",
    date_of_birth: "1982-07-05",
    phone: "+232 79 789 012",
    emergency_contact: "Abu Kamara",
    emergency_phone: "+232 79 789 013",
    address: "73 Kambia District",
    district: "Northern Province",
    chiefdom: "Kambia",
    marital_status: "married",
    education: "none",
    occupation: "Farmer",
    status: "pregnant",
    gestational_age: 34,
    expected_delivery_date: "2024-03-20",
    pregnancy_number: 6,
    previous_pregnancies: 5,
    previous_deliveries: 4,
    last_menstrual_period: "2023-07-01",
    risk_level: "high",
    last_visit: "2024-01-24",
    next_appointment: "2024-01-31",
    medical_history: "Grand multipara, previous stillbirth, hypertension",
    current_medications: "Methyldopa, Prenatal vitamins, Iron supplements",
    risk_factors: ["Grand multipara", "Previous stillbirth", "Hypertension", "Age over 40"],
    blood_type: "B+",
    blood_pressure: "150/100",
    weight: 82,
    height: 162,
    bmi: 31.2,
    allergies: "None known",
    insurance_number: "SL-2024-013",
  },
  {
    id: "14",
    created_at: "2024-01-14T00:00:00Z",
    first_name: "Yeabu",
    last_name: "Turay",
    date_of_birth: "1998-11-22",
    phone: "+232 76 890 123",
    emergency_contact: "Mariama Turay",
    emergency_phone: "+232 76 890 124",
    address: "29 Bonthe Island",
    district: "Southern Province",
    chiefdom: "Bonthe",
    marital_status: "married",
    education: "primary",
    occupation: "Fishmonger",
    status: "lactating",
    child_name: "Saidu",
    child_gender: "male",
    birth_weight: 2.5,
    current_child_weight: 3.1,
    breastfeeding_status: "Exclusive",
    delivery_date: "2023-12-20",
    risk_level: "medium",
    last_visit: "2024-01-20",
    next_appointment: "2024-02-17",
    blood_type: "O-",
    blood_pressure: "118/76",
    weight: 50,
    height: 152,
    bmi: 21.6,
    medical_history: "Low birth weight baby, prolonged labor",
    current_medications: "Iron supplements, Vitamin D",
    risk_factors: ["Low birth weight baby"],
    insurance_number: "SL-2024-014",
  },
  {
    id: "15",
    created_at: "2024-01-15T00:00:00Z",
    first_name: "Tenneh",
    last_name: "Gborie",
    date_of_birth: "1994-03-08",
    phone: "+232 78 012 345",
    emergency_contact: "James Gborie",
    emergency_phone: "+232 78 012 346",
    address: "86 Kenema Highway",
    district: "Eastern Province",
    chiefdom: "Kenema",
    marital_status: "married",
    education: "secondary",
    occupation: "Hairdresser",
    status: "pregnant",
    gestational_age: 8,
    expected_delivery_date: "2024-10-10",
    pregnancy_number: 1,
    previous_pregnancies: 0,
    previous_deliveries: 0,
    last_menstrual_period: "2024-01-05",
    risk_level: "low",
    last_visit: "2024-01-28",
    next_appointment: "2024-02-25",
    medical_history: "First pregnancy, healthy",
    current_medications: "Prenatal vitamins, Folic acid",
    blood_type: "A+",
    blood_pressure: "112/72",
    weight: 62,
    height: 165,
    bmi: 22.8,
    allergies: "None known",
    insurance_number: "SL-2024-015",
  },
  // Additional comprehensive demo patients for robust demo
  {
    id: "16",
    created_at: "2024-01-16T00:00:00Z",
    first_name: "Zainab",
    last_name: "Fofana",
    date_of_birth: "1990-06-14",
    phone: "+232 77 345 678",
    emergency_contact: "Ibrahim Fofana",
    emergency_phone: "+232 77 345 679",
    address: "92 Kailahun Town",
    district: "Eastern Province",
    chiefdom: "Kailahun",
    marital_status: "married",
    education: "tertiary",
    occupation: "Teacher",
    status: "lactating",
    child_name: "Aisha",
    child_gender: "female",
    birth_weight: 3.4,
    current_child_weight: 4.8,
    breastfeeding_status: "Exclusive",
    delivery_date: "2023-11-20",
    risk_level: "low",
    last_visit: "2024-01-26",
    next_appointment: "2024-02-23",
    blood_type: "B+",
    blood_pressure: "115/75",
    weight: 61,
    height: 168,
    bmi: 21.6,
    medical_history: "Normal delivery, exclusive breastfeeding",
    current_medications: "Multivitamins, Iron supplements",
    insurance_number: "SL-2024-016",
  },
  {
    id: "17",
    created_at: "2024-01-17T00:00:00Z",
    first_name: "Memuna",
    last_name: "Conteh",
    date_of_birth: "1985-09-03",
    phone: "+232 79 456 789",
    emergency_contact: "Salifu Conteh",
    emergency_phone: "+232 79 456 790",
    address: "47 Pujehun District",
    district: "Southern Province",
    chiefdom: "Pujehun",
    marital_status: "married",
    education: "primary",
    occupation: "Farmer",
    status: "pregnant",
    gestational_age: 30,
    expected_delivery_date: "2024-04-05",
    pregnancy_number: 4,
    previous_pregnancies: 3,
    previous_deliveries: 3,
    last_menstrual_period: "2023-08-10",
    risk_level: "medium",
    last_visit: "2024-01-29",
    next_appointment: "2024-02-12",
    medical_history: "Previous normal deliveries, mild anemia",
    current_medications: "Iron supplements, Prenatal vitamins",
    risk_factors: ["Anemia", "Multiple pregnancies"],
    blood_type: "O+",
    blood_pressure: "125/80",
    weight: 70,
    height: 160,
    bmi: 27.3,
    allergies: "None known",
    insurance_number: "SL-2024-017",
  },
  {
    id: "18",
    created_at: "2024-01-18T00:00:00Z",
    first_name: "Kadiatu",
    last_name: "Jalloh",
    date_of_birth: "2000-12-25",
    phone: "+232 76 567 890",
    emergency_contact: "Fatima Jalloh",
    emergency_phone: "+232 76 567 891",
    address: "33 Kono District",
    district: "Eastern Province",
    chiefdom: "Kono",
    marital_status: "single",
    education: "secondary",
    occupation: "Student",
    status: "pregnant",
    gestational_age: 20,
    expected_delivery_date: "2024-07-15",
    pregnancy_number: 1,
    previous_pregnancies: 0,
    previous_deliveries: 0,
    last_menstrual_period: "2023-11-20",
    risk_level: "medium",
    last_visit: "2024-01-30",
    next_appointment: "2024-02-27",
    medical_history: "First pregnancy, young mother",
    current_medications: "Prenatal vitamins, Folic acid, Iron supplements",
    risk_factors: ["Young maternal age", "First pregnancy"],
    blood_type: "AB+",
    blood_pressure: "108/68",
    weight: 55,
    height: 162,
    bmi: 21.0,
    allergies: "None known",
    insurance_number: "SL-2024-018",
  },
  {
    id: "19",
    created_at: "2024-01-19T00:00:00Z",
    first_name: "Sia",
    last_name: "Bangura",
    date_of_birth: "1993-04-17",
    phone: "+232 78 678 901",
    emergency_contact: "Mohamed Bangura",
    emergency_phone: "+232 78 678 902",
    address: "58 Western Rural",
    district: "Western Area",
    chiefdom: "Western Rural",
    marital_status: "married",
    education: "tertiary",
    occupation: "Nurse",
    status: "lactating",
    child_name: "Musa",
    child_gender: "male",
    birth_weight: 3.6,
    current_child_weight: 7.2,
    breastfeeding_status: "Mixed feeding",
    delivery_date: "2023-07-30",
    risk_level: "low",
    last_visit: "2024-01-27",
    next_appointment: "2024-02-24",
    blood_type: "A-",
    blood_pressure: "120/78",
    weight: 64,
    height: 166,
    bmi: 23.2,
    medical_history: "Normal delivery, healthy baby",
    current_medications: "Multivitamins",
    insurance_number: "SL-2024-019",
  },
  {
    id: "20",
    created_at: "2024-01-20T00:00:00Z",
    first_name: "Ramatu",
    last_name: "Koroma",
    date_of_birth: "1981-08-09",
    phone: "+232 77 789 012",
    emergency_contact: "Alimamy Koroma",
    emergency_phone: "+232 77 789 013",
    address: "71 Koinadugu District",
    district: "Northern Province",
    chiefdom: "Koinadugu",
    marital_status: "married",
    education: "none",
    occupation: "Petty trader",
    status: "pregnant",
    gestational_age: 36,
    expected_delivery_date: "2024-03-10",
    pregnancy_number: 7,
    previous_pregnancies: 6,
    previous_deliveries: 5,
    last_menstrual_period: "2023-06-20",
    risk_level: "high",
    last_visit: "2024-01-31",
    next_appointment: "2024-02-07",
    medical_history: "Grand multipara, previous cesarean section, diabetes",
    current_medications: "Insulin, Prenatal vitamins, Iron supplements",
    risk_factors: ["Grand multipara", "Previous C-section", "Diabetes", "Age over 40"],
    blood_type: "B-",
    blood_pressure: "140/90",
    weight: 85,
    height: 158,
    bmi: 34.1,
    allergies: "Codeine",
    insurance_number: "SL-2024-020",
  },
  {
    id: "21",
    created_at: "2024-01-21T00:00:00Z",
    first_name: "Musu",
    last_name: "Sesay",
    date_of_birth: "1996-01-11",
    phone: "+232 79 890 123",
    emergency_contact: "Amara Sesay",
    emergency_phone: "+232 79 890 124",
    address: "25 Port Loko District",
    district: "Northern Province",
    chiefdom: "Port Loko",
    marital_status: "married",
    education: "secondary",
    occupation: "Seamstress",
    status: "lactating",
    child_name: "Aminata",
    child_gender: "female",
    birth_weight: 2.8,
    current_child_weight: 4.2,
    breastfeeding_status: "Exclusive",
    delivery_date: "2023-10-05",
    risk_level: "medium",
    last_visit: "2024-01-25",
    next_appointment: "2024-02-22",
    blood_type: "O+",
    blood_pressure: "122/79",
    weight: 56,
    height: 161,
    bmi: 21.6,
    medical_history: "Low birth weight baby, prolonged breastfeeding",
    current_medications: "Iron supplements, Vitamin D",
    risk_factors: ["Low birth weight baby"],
    insurance_number: "SL-2024-021",
  },
  {
    id: "22",
    created_at: "2024-01-22T00:00:00Z",
    first_name: "Adama",
    last_name: "Mansaray",
    date_of_birth: "1989-05-20",
    phone: "+232 76 012 345",
    emergency_contact: "Sahr Mansaray",
    emergency_phone: "+232 76 012 346",
    address: "39 Kamakwie Town",
    district: "Northern Province",
    chiefdom: "Kamakwie",
    marital_status: "married",
    education: "primary",
    occupation: "Market vendor",
    status: "pregnant",
    gestational_age: 14,
    expected_delivery_date: "2024-08-30",
    pregnancy_number: 3,
    previous_pregnancies: 2,
    previous_deliveries: 2,
    last_menstrual_period: "2023-12-20",
    risk_level: "low",
    last_visit: "2024-01-28",
    next_appointment: "2024-02-25",
    medical_history: "Previous normal deliveries",
    current_medications: "Prenatal vitamins, Folic acid",
    blood_type: "A+",
    blood_pressure: "118/76",
    weight: 63,
    height: 164,
    bmi: 23.4,
    allergies: "None known",
    insurance_number: "SL-2024-022",
  },
]

const comprehensiveAppointments: Appointment[] = [
  // Today's appointments (2025-06-17)
  {
    id: "1",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "1",
    appointment_date: "2025-06-17",
    appointment_time: "09:00",
    type: "Antenatal Check",
    status: "confirmed",
    priority: "normal",
    duration: 30,
    notes: "32-week prenatal checkup",
  },
  {
    id: "2",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "2",
    appointment_date: "2025-06-17",
    appointment_time: "10:30",
    type: "Postnatal Visit",
    status: "confirmed",
    priority: "normal",
    duration: 20,
    notes: "Breastfeeding support and child weight check",
  },
  {
    id: "3",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "13",
    appointment_date: "2025-06-17",
    appointment_time: "14:00",
    type: "High-Risk Monitoring",
    status: "confirmed",
    priority: "urgent",
    duration: 45,
    notes: "Blood pressure monitoring and fetal assessment",
  },
  {
    id: "4",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "4",
    appointment_date: "2025-06-17",
    appointment_time: "11:00",
    type: "Routine Checkup",
    status: "confirmed",
    priority: "normal",
    duration: 30,
    notes: "Postpartum checkup",
  },
  {
    id: "5",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "5",
    appointment_date: "2025-06-17",
    appointment_time: "15:30",
    type: "Emergency Consultation",
    status: "confirmed",
    priority: "urgent",
    duration: 60,
    notes: "High blood pressure monitoring",
  },
  // Future appointments
  {
    id: "6",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "6",
    appointment_date: "2025-06-20",
    appointment_time: "08:30",
    type: "Antenatal Check",
    status: "confirmed",
    priority: "routine",
    duration: 45,
    notes: "24-week checkup, glucose screening",
  },
  {
    id: "7",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "7",
    appointment_date: "2025-06-25",
    appointment_time: "13:30",
    type: "Pre-delivery Assessment",
    status: "confirmed",
    priority: "urgent",
    duration: 60,
    notes: "36-week assessment, delivery planning",
  },
  {
    id: "8",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "8",
    appointment_date: "2025-06-22",
    appointment_time: "15:00",
    type: "Postnatal Visit",
    status: "confirmed",
    priority: "normal",
    duration: 30,
    notes: "2-month postnatal check, immunizations",
  },
  {
    id: "9",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "9",
    appointment_date: "2025-06-24",
    appointment_time: "10:00",
    type: "Antenatal Check",
    status: "confirmed",
    priority: "routine",
    duration: 45,
    notes: "20-week anatomy scan",
  },
  {
    id: "10",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "10",
    appointment_date: "2025-06-19",
    appointment_time: "14:30",
    type: "Breastfeeding Support",
    status: "confirmed",
    priority: "normal",
    duration: 30,
    notes: "Weaning guidance and nutrition counseling",
  },
  {
    id: "11",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "12",
    appointment_date: "2025-06-26",
    appointment_time: "11:00",
    type: "First Antenatal Visit",
    status: "confirmed",
    priority: "normal",
    duration: 60,
    notes: "Complete initial assessment, counseling",
  },
  {
    id: "12",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "14",
    appointment_date: "2025-06-21",
    appointment_time: "15:30",
    type: "Child Growth Monitoring",
    status: "confirmed",
    priority: "normal",
    duration: 30,
    notes: "Weight check and development assessment",
  },
  {
    id: "13",
    created_at: "2025-06-17T00:00:00Z",
    patient_id: "15",
    appointment_date: "2025-06-27",
    appointment_time: "08:00",
    type: "Early Pregnancy Check",
    status: "confirmed",
    priority: "routine",
    duration: 45,
    notes: "Confirm pregnancy, initial counseling",
  },
]

// Database functions with comprehensive fallback data
export const patientService = {
  async getAll(): Promise<Patient[]> {
    // Use demo data if in demo mode or Supabase not configured
    if (isUsingDemoData) {
      console.log('Using demo data for patients')
      return comprehensivePatients
    }

    try {
      const { data, error } = await supabase!
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching patients from Supabase:', error)
        console.log('Falling back to demo data')
        return comprehensivePatients
      }

      return data || comprehensivePatients
    } catch (error) {
      console.error('Error in patientService.getAll:', error)
      console.log('Falling back to demo data')
      return comprehensivePatients
    }
  },

  async getById(id: string): Promise<Patient | null> {
    if (!isSupabaseConfigured || !supabase) {
      const patient = comprehensivePatients.find((p) => p.id === id)
      return Promise.resolve(patient || null)
    }

    try {
      const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()

      if (error) {
        console.error("Database error, using local data:", error)
        const patient = comprehensivePatients.find((p) => p.id === id)
        return patient || null
      }

      return data as Patient
    } catch (error) {
      console.error("Connection error, using local data:", error)
      const patient = comprehensivePatients.find((p) => p.id === id)
      return patient || null
    }
  },

  async create(patient: Omit<Patient, "id" | "created_at">): Promise<Patient> {
    if (!isSupabaseConfigured || !supabase) {
      const newPatient: Patient = {
        ...patient,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensivePatients.unshift(newPatient)
      return Promise.resolve(newPatient)
    }

    try {
      const { data, error } = await supabase.from("patients").insert([patient]).select().single()

      if (error) throw error
      return data as Patient
    } catch (error) {
      console.error("Error creating patient:", error)
      // Fallback to local storage
      const newPatient: Patient = {
        ...patient,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensivePatients.unshift(newPatient)
      return newPatient
    }
  },

  async update(id: string, updates: Partial<Patient>): Promise<Patient> {
    if (!isSupabaseConfigured || !supabase) {
      const index = comprehensivePatients.findIndex((p) => p.id === id)
      if (index !== -1) {
        comprehensivePatients[index] = { ...comprehensivePatients[index], ...updates }
        return Promise.resolve(comprehensivePatients[index])
      }
      throw new Error("Patient not found")
    }

    try {
      const { data, error } = await supabase.from("patients").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data as Patient
    } catch (error) {
      console.error("Error updating patient:", error)
      // Fallback to local update
      const index = comprehensivePatients.findIndex((p) => p.id === id)
      if (index !== -1) {
        comprehensivePatients[index] = { ...comprehensivePatients[index], ...updates }
        return comprehensivePatients[index]
      }
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      const index = comprehensivePatients.findIndex((p) => p.id === id)
      if (index !== -1) {
        comprehensivePatients.splice(index, 1)
      }
      return Promise.resolve()
    }

    try {
      const { error } = await supabase.from("patients").delete().eq("id", id)
      if (error) throw error
    } catch (error) {
      console.error("Error deleting patient:", error)
      throw error
    }
  },
}

// Visit notes storage - starts empty, populated by user-created notes
const comprehensiveVisitNotes: VisitNote[] = []

// Visit Notes Service
export const visitService = {
  async getAll(): Promise<VisitNote[]> {
    if (!isSupabaseConfigured || !supabase) {
      return Promise.resolve(comprehensiveVisitNotes)
    }

    try {
      const { data, error } = await supabase
        .from("visit_notes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Database error, using local data:", error)
        return comprehensiveVisitNotes
      }

      return data || comprehensiveVisitNotes
    } catch (error) {
      console.error('Error in visitService.getAll:', error)
      console.log('Falling back to demo data')
      return comprehensiveVisitNotes
    }
  },

  async getByPatientId(patientId: string): Promise<VisitNote[]> {
    if (!isSupabaseConfigured || !supabase) {
      const filteredVisits = comprehensiveVisitNotes.filter((visit) => visit.patient_id === patientId)
      return Promise.resolve(filteredVisits)
    }

    try {
      const { data, error } = await supabase
        .from("visit_notes")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Database error, using local data:", error)
        const filteredVisits = comprehensiveVisitNotes.filter((visit) => visit.patient_id === patientId)
        return filteredVisits
      }

      return data as VisitNote[]
    } catch (error) {
      console.error("Connection error, using local data:", error)
      const filteredVisits = comprehensiveVisitNotes.filter((visit) => visit.patient_id === patientId)
      return filteredVisits
    }
  },

  async create(visitNote: Omit<VisitNote, "id" | "created_at">): Promise<VisitNote> {
    if (!isSupabaseConfigured || !supabase) {
      const newVisitNote: VisitNote = {
        ...visitNote,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensiveVisitNotes.unshift(newVisitNote)
      return Promise.resolve(newVisitNote)
    }

    try {
      const { data, error } = await supabase.from("visit_notes").insert([visitNote]).select().single()

      if (error) throw error
      return data as VisitNote
    } catch (error) {
      console.error("Error creating visit note:", error)
      // Fallback to local storage
      const newVisitNote: VisitNote = {
        ...visitNote,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensiveVisitNotes.unshift(newVisitNote)
      return newVisitNote
    }
  },

  async update(id: string, updates: Partial<VisitNote>): Promise<VisitNote> {
    if (!isSupabaseConfigured || !supabase) {
      const index = comprehensiveVisitNotes.findIndex((v) => v.id === id)
      if (index !== -1) {
        comprehensiveVisitNotes[index] = { ...comprehensiveVisitNotes[index], ...updates }
        return Promise.resolve(comprehensiveVisitNotes[index])
      }
      throw new Error("Visit note not found")
    }

    try {
      const { data, error } = await supabase.from("visit_notes").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data as VisitNote
    } catch (error) {
      console.error("Error updating visit note:", error)
      // Fallback to local update
      const index = comprehensiveVisitNotes.findIndex((v) => v.id === id)
      if (index !== -1) {
        comprehensiveVisitNotes[index] = { ...comprehensiveVisitNotes[index], ...updates }
        return comprehensiveVisitNotes[index]
      }
      throw error
    }
  },
}

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    // Use demo data if in demo mode or Supabase not configured
    if (isUsingDemoData) {
      console.log('Using demo data for appointments')
      const appointmentsWithPatients = comprehensiveAppointments.map((apt) => ({
        ...apt,
        patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
      }))
      return appointmentsWithPatients
    }

    try {
      const { data, error } = await supabase!
        .from('appointments')
        .select(`
          *,
          patient:patients(*)
        `)
        .order('appointment_date', { ascending: true })

      if (error) {
        console.error('Error fetching appointments from Supabase:', error)
        console.log('Falling back to demo data')
        const appointmentsWithPatients = comprehensiveAppointments.map((apt) => ({
          ...apt,
          patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
        }))
        return appointmentsWithPatients
      }

      return data || comprehensiveAppointments
    } catch (error) {
      console.error('Error in appointmentService.getAll:', error)
      console.log('Falling back to demo data')
      const appointmentsWithPatients = comprehensiveAppointments.map((apt) => ({
        ...apt,
        patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
      }))
      return appointmentsWithPatients
    }
  },

  async getByDate(date: string): Promise<Appointment[]> {
    if (!isSupabaseConfigured || !supabase) {
      const filteredAppointments = comprehensiveAppointments
        .filter((apt) => apt.appointment_date === date)
        .map((apt) => ({
          ...apt,
          patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
        }))
      return Promise.resolve(filteredAppointments)
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patients(*)
        `)
        .eq("appointment_date", date)
        .order("appointment_time", { ascending: true })

      if (error) {
        console.error("Database error, using local data:", error)
        const filteredAppointments = comprehensiveAppointments
          .filter((apt) => apt.appointment_date === date)
          .map((apt) => ({
            ...apt,
            patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
          }))
        return filteredAppointments
      }

      return data as Appointment[]
    } catch (error) {
      console.error("Connection error, using local data:", error)
      const filteredAppointments = comprehensiveAppointments
        .filter((apt) => apt.appointment_date === date)
        .map((apt) => ({
          ...apt,
          patient: comprehensivePatients.find((p) => p.id === apt.patient_id),
        }))
      return filteredAppointments
    }
  },

  async create(appointment: Omit<Appointment, "id" | "created_at">): Promise<Appointment> {
    if (!isSupabaseConfigured || !supabase) {
      const newAppointment: Appointment = {
        ...appointment,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensiveAppointments.push(newAppointment)
      return Promise.resolve(newAppointment)
    }

    try {
      const { data, error } = await supabase.from("appointments").insert([appointment]).select().single()

      if (error) throw error
      return data as Appointment
    } catch (error) {
      console.error("Error creating appointment:", error)
      // Fallback to local storage
      const newAppointment: Appointment = {
        ...appointment,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      }
      comprehensiveAppointments.push(newAppointment)
      return newAppointment
    }
  },

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    if (!isSupabaseConfigured || !supabase) {
      const index = comprehensiveAppointments.findIndex((a) => a.id === id)
      if (index !== -1) {
        comprehensiveAppointments[index] = { ...comprehensiveAppointments[index], ...updates }
        return Promise.resolve(comprehensiveAppointments[index])
      }
      throw new Error("Appointment not found")
    }

    try {
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data as Appointment
    } catch (error) {
      console.error("Error updating appointment:", error)
      // Fallback to local update
      const index = comprehensiveAppointments.findIndex((a) => a.id === id)
      if (index !== -1) {
        comprehensiveAppointments[index] = { ...comprehensiveAppointments[index], ...updates }
        return comprehensiveAppointments[index]
      }
      throw error
    }
  },
}
