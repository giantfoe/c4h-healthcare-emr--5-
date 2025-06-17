-- Insert sample patients
INSERT INTO patients (
  first_name, last_name, date_of_birth, phone, emergency_contact, emergency_phone,
  address, district, status, gestational_age, expected_delivery_date,
  risk_level, last_visit, next_appointment
) VALUES 
(
  'Aminata', 'Kamara', '1995-03-15', '+232 76 123 456', 'Mohamed Kamara', '+232 76 123 457',
  'Kissy Street, Freetown', 'western-area', 'pregnant', 32, '2024-04-15',
  'low', '2024-01-15', '2024-01-22'
),
(
  'Fatima', 'Bangura', '1999-07-22', '+232 78 345 678', 'Ibrahim Bangura', '+232 78 345 679',
  'Kenema Town Center', 'eastern', 'lactating', NULL, NULL,
  'low', '2024-01-12', '2024-01-25'
),
(
  'Adama', 'Turay', '1988-11-08', '+232 76 567 890', 'Salifu Turay', '+232 76 567 891',
  'Port Loko Central', 'northern', 'pregnant', 38, '2024-02-01',
  'high', '2024-01-14', '2024-01-20'
),
(
  'Mariama', 'Sesay', '2001-05-12', '+232 77 234 567', 'Amara Sesay', '+232 77 234 568',
  'Bo Town', 'southern', 'pregnant', 28, '2024-05-20',
  'medium', '2024-01-13', '2024-01-21'
),
(
  'Hawa', 'Koroma', '1997-09-30', '+232 79 456 789', 'Sahr Koroma', '+232 79 456 790',
  'Makeni Central', 'northern', 'lactating', NULL, NULL,
  'low', '2024-01-10', '2024-01-24'
);

-- Update additional patient details
UPDATE patients SET 
  child_name = 'Ibrahim',
  child_gender = 'male',
  birth_weight = 3.2,
  current_child_weight = 5.2,
  breastfeeding_status = 'exclusive',
  delivery_date = '2023-10-15'
WHERE first_name = 'Fatima' AND last_name = 'Bangura';

UPDATE patients SET 
  child_name = 'Fatima',
  child_gender = 'female',
  birth_weight = 2.9,
  current_child_weight = 3.8,
  breastfeeding_status = 'mixed',
  delivery_date = '2023-12-01'
WHERE first_name = 'Hawa' AND last_name = 'Koroma';

UPDATE patients SET 
  medical_history = 'Previous gestational diabetes',
  current_medications = 'Insulin, Prenatal vitamins',
  risk_factors = ARRAY['Diabetes', 'Age over 35']
WHERE first_name = 'Adama' AND last_name = 'Turay';

-- Insert sample appointments
INSERT INTO appointments (
  patient_id, appointment_date, appointment_time, type, status, priority, duration
) 
SELECT 
  p.id,
  '2024-01-20'::date,
  '09:00'::time,
  'Antenatal Check',
  'confirmed',
  'routine',
  45
FROM patients p WHERE p.first_name = 'Aminata' AND p.last_name = 'Kamara';

INSERT INTO appointments (
  patient_id, appointment_date, appointment_time, type, status, priority, duration
) 
SELECT 
  p.id,
  '2024-01-20'::date,
  '10:30'::time,
  'Postnatal Visit',
  'pending',
  'normal',
  30
FROM patients p WHERE p.first_name = 'Fatima' AND p.last_name = 'Bangura';

INSERT INTO appointments (
  patient_id, appointment_date, appointment_time, type, status, priority, duration
) 
SELECT 
  p.id,
  '2024-01-20'::date,
  '14:00'::time,
  'High-Risk Monitoring',
  'confirmed',
  'urgent',
  60
FROM patients p WHERE p.first_name = 'Adama' AND p.last_name = 'Turay';

INSERT INTO appointments (
  patient_id, appointment_date, appointment_time, type, status, priority, duration
) 
SELECT 
  p.id,
  '2024-01-20'::date,
  '16:15'::time,
  'Breastfeeding Support',
  'completed',
  'normal',
  30
FROM patients p WHERE p.first_name = 'Hawa' AND p.last_name = 'Koroma';
