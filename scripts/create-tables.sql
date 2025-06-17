-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  chiefdom TEXT,
  marital_status TEXT,
  education TEXT,
  status TEXT NOT NULL CHECK (status IN ('pregnant', 'lactating')),
  gestational_age INTEGER,
  expected_delivery_date DATE,
  pregnancy_number INTEGER,
  previous_pregnancies INTEGER,
  previous_deliveries INTEGER,
  last_menstrual_period DATE,
  delivery_date DATE,
  child_name TEXT,
  child_gender TEXT,
  birth_weight DECIMAL,
  current_child_weight DECIMAL,
  breastfeeding_status TEXT,
  blood_type TEXT,
  allergies TEXT,
  medical_history TEXT,
  current_medications TEXT,
  family_history TEXT,
  risk_factors TEXT[],
  insurance_number TEXT,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  last_visit DATE,
  next_appointment DATE
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'normal', 'urgent')),
  duration INTEGER NOT NULL DEFAULT 30,
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_risk_level ON patients(risk_level);
CREATE INDEX IF NOT EXISTS idx_patients_next_appointment ON patients(next_appointment);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you can restrict this later)
CREATE POLICY "Allow all operations on patients" ON patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on appointments" ON appointments FOR ALL USING (true);
