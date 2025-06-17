# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Next.js 14 and TypeScript
- Comprehensive patient management system
- Appointment scheduling functionality
- Dashboard with health analytics
- Mobile-responsive design
- Offline capability with service worker
- Demo data for testing
- Enhanced user experience with clear disabled button styling and helpful validation messages
- Smooth transitions and hover effects for better interactivity
- Complete visit flow implementation with timer, notes, and visit logging
- Visit session component with start/pause/end functionality
- Visit notes service with CRUD operations and demo data support
- View Notes functionality for completed appointments
- Comprehensive visit notes display with patient information
- Organized notes sections: chief complaint, examination findings, diagnosis, treatment plan
- Session-based temporary data storage (resets on server restart)
- **Functional header buttons with dropdown menus:**
  - Search functionality with quick navigation to patient and appointment lists
  - Notifications panel with real-time alerts for high-risk patients, upcoming appointments, and system updates
  - Settings menu with profile, preferences, data export, help, and sign-out options
  - Click-outside-to-close functionality for all dropdowns
- **Database integration for patient registration:**
  - Patient form now saves data to database using patientService
  - Automatic risk level calculation based on age, pregnancy history, and risk factors
  - Form validation and error handling with loading states
  - Success feedback and form reset after submission
- Enhanced button styling with clear disabled state feedback
- Helper text for appointment form validation
- **Export Report Functionality**: Added comprehensive report export feature in Reports section
  - Generates downloadable text reports with all key maternal health metrics
  - Includes monthly trends, pregnancy outcomes, breastfeeding success rates, and KPIs
  - Automatic file naming with date stamps (maternal-health-report-YYYY-MM-DD.txt)
  - Professional formatting suitable for stakeholder review and offline analysis
- **Enhanced Empty States**: Improved patient list empty state with contextual messages
  - Smart messaging based on search terms and filters
  - "Clear search and filters" button for better UX
  - Positive messaging for high-risk filter when no results found
- **Health API Endpoint**: Added `/api/health` endpoint for system monitoring
  - Returns service status, timestamp, and version information
  - Eliminates 404 errors in server logs
- **Demo Documentation**: Created comprehensive demo guide for investor presentations
  - 15-20 minute structured demo flow
  - Key selling points and technical highlights
  - Preparation checklist and closing points

### Fixed
- **TypeScript Error in Appointment Scheduler**: Added "in-progress" to allowed appointment status values in Appointment interface
  - Resolved TypeScript error 2322 where "in-progress" was not assignable to the status type
  - Updated status type from "pending" | "confirmed" | "completed" | "cancelled" to include "in-progress"
  - Enables proper visit session management with in-progress appointment status
- **Next.js Metadata Warnings**: Fixed viewport and themeColor metadata warnings
  - Moved themeColor and viewport from metadata to separate viewport export
  - Eliminates console warnings about unsupported metadata properties
  - Follows Next.js 14+ best practices for metadata configuration
- **Enhanced Error Handling**: Improved error handling in appointment scheduler
  - Added fallback to empty array when appointment loading fails
  - Better error logging and user experience

### Changed
- **Form Placeholder Colors**: Updated placeholder text colors to use black with low opacity for better readability
  - Light mode: Changed from gray (`100 116 139`) to black with 40% opacity (`0 0 0 / 0.4`)
  - Dark mode: Changed from light gray (`148 163 184`) to black with 50% opacity (`0 0 0 / 0.5`)
  - Affects all form inputs, textareas, and select components across the application

- **Header Button Styling**: Enhanced the search, notifications, and settings buttons on the home page
  - Changed from simple rounded-full ghost buttons to modern glassmorphism design
  - Added semi-transparent white background with backdrop blur effect
  - Implemented subtle borders and improved hover states with shadow effects
  - Reduced icon size from 20px to 16px for better proportion
  - Added notification badge indicator on the bell icon
  - Improved spacing between buttons for better touch targets

- **Patient form functionality:** Updated from simulation to actual database operations with comprehensive data mapping and risk assessment
- **Appointment system:** Verified and confirmed proper integration with appointmentService for creating and managing appointments
- Improved appointment form user experience with visual feedback

### Fixed
- **Contrast Issues**: Improved text contrast across the application by replacing light pink text colors with more accessible alternatives
  - Changed `text-pink-600` to `text-pink-800` for better visibility
  - Replaced `text-pink-900` and `text-pink-700` with `text-slate-900` and `text-slate-700` respectively on light backgrounds
  - Updated components: patient-form.tsx, page.tsx, patient-details.tsx, reports.tsx, appointment-scheduler.tsx, mobile-nav.tsx, patient-list.tsx
  - Added CSS rules for `.pink-card` class to ensure consistent contrast on pink backgrounds
  - All changes maintain WCAG 2.1 AA compliance while preserving the design aesthetic

- **VS Code Configuration**: Created `.vscode/settings.json` to resolve CSS linting warnings
  - Disabled unknown at-rule warnings for Tailwind CSS directives (`@tailwind`, `@apply`)
  - Added Tailwind CSS language support and custom data configuration
  - Configured CSS validation settings to ignore Tailwind-specific syntax

- **Patient registration:** Fixed non-functional patient form that was only showing alerts instead of saving data
- **Header interactivity:** Connected search, notifications, and settings buttons to functional dropdown interfaces
- **CRITICAL**: Fixed appointment type selection bug where form was storing label instead of value, preventing form submission
- Enhanced "Schedule Appointment" button styling to clearly show disabled state
- Added helpful validation messages to guide users through form completion
- Fixed visit session component prop mismatch causing "End Visit" button to fail
- Corrected interface definitions and async handling in visit completion flow

## [Latest] - 2025-06-17

### Fixed
- **CRITICAL**: Fixed patient ID mismatch in visit notes data - changed format from "patient_1", "patient_2" to "1", "2" to match appointment data
- Removed fabricated mock visit notes data to ensure only user-created notes are displayed
- Removed "Visit #1" text from notes view display
- Fixed Today's Schedule section not displaying current appointments by adding dashboard data refresh when returning to dashboard view

### Added
- Empty visit notes array to start fresh with only user-created content
- Current date appointments (2025-06-17) for testing patient information display
- Dashboard data reload functionality when switching back to dashboard view

## [2024-01-XX] - Visit Flow Implementation

### Added
- Complete visit flow implementation with visit session component
- Visit notes service for managing patient visit records
- Integration between appointment scheduler and visit session
- "View Notes" functionality for completed appointments
- Comprehensive display of visit notes including chief complaint, examination findings, diagnosis, treatment plan, follow-up dates, and provider information
- Session-based temporary data storage for visit notes during server runtime

### Fixed
- **Critical Data Issue**: Removed fabricated mock visit notes data
  - Cleared pre-populated demo visit notes that appeared fake/mock in nature
  - Visit notes now start empty and only show actual user-created notes
  - Ensures authentic data display for healthcare providers
- Visit session prop mismatch between `appointment-scheduler.tsx` and `visit-session.tsx`
- Async handling in visit completion flow
- Proper integration of visit notes creation with appointment status updates
- **Critical Bug Fix**: Patient ID mismatch in visit notes data - corrected `patient_id` values from "patient_1", "patient_2" format to "1", "2" format to match appointment data structure
- View Notes functionality now correctly filters and displays notes for the specific selected patient instead of showing all visit notes

## [2024-01-XX] - TypeScript Error Fixes & VS Code Configuration

### Fixed
- **TypeScript Errors**: Resolved all 29 TypeScript compilation errors
  - Fixed appointment priority values: changed `"high"` to `"urgent"` in appointment data
  - Fixed appointment status values: changed `"scheduled"` to `"confirmed"` in appointment data
  - Added proper type annotations (`Patient[]` and `Appointment[]`) to state variables in `app/page.tsx`
  - Imported `Patient` and `Appointment` types from `app/lib/supabase`
- **VS Code Warnings**: Resolved CSS linting warnings for Tailwind CSS directives
  - Created `.vscode/settings.json` to suppress unknown at-rule warnings
  - Added custom CSS data definitions for Tailwind directives (@tailwind, @apply, @layer, etc.)
  - Configured CSS validation settings to ignore Tailwind-specific syntax

### Changed
- **Type Safety**: Enhanced type safety across the application
- **Data Consistency**: Ensured appointment data matches TypeScript interface definitions
- **Developer Experience**: Improved VS Code integration with proper Tailwind CSS support

### Technical Details
- Updated `app/lib/supabase.ts`: Fixed priority and status type mismatches
- Updated `app/page.tsx`: Added explicit type annotations for React state
- Added `.vscode/settings.json`: Configured CSS linting and Tailwind CSS support
- Verified with TypeScript compiler: 0 errors after fixes
- Confirmed successful build: `npm run build` completed without errors