// ─── STUDENTS ────────────────────────────────────────────────────────────────
export const students = [
  { id: 'STU001', name: 'Alice Johnson', grade: '10A', dob: '2010-03-15', gender: 'Female', email: 'alice@school.edu', phone: '+1-555-0101', parentName: 'Robert Johnson', parentPhone: '+1-555-0100', address: '123 Maple St', status: 'Active', gpa: 3.8, photo: null, allergies: 'Peanuts', bloodType: 'O+', enrollDate: '2020-09-01' },
  { id: 'STU002', name: 'Brian Smith', grade: '10A', dob: '2010-07-22', gender: 'Male', email: 'brian@school.edu', phone: '+1-555-0102', parentName: 'Carol Smith', parentPhone: '+1-555-0103', address: '456 Oak Ave', status: 'Active', gpa: 3.2, photo: null, allergies: 'None', bloodType: 'A+', enrollDate: '2020-09-01' },
  { id: 'STU003', name: 'Clara Davis', grade: '11B', dob: '2009-11-08', gender: 'Female', email: 'clara@school.edu', phone: '+1-555-0104', parentName: 'Mark Davis', parentPhone: '+1-555-0105', address: '789 Pine Rd', status: 'Active', gpa: 3.9, photo: null, allergies: 'Dairy', bloodType: 'B+', enrollDate: '2019-09-01' },
  { id: 'STU004', name: 'David Lee', grade: '9C', dob: '2011-05-30', gender: 'Male', email: 'david@school.edu', phone: '+1-555-0106', parentName: 'Susan Lee', parentPhone: '+1-555-0107', address: '321 Elm St', status: 'Active', gpa: 2.9, photo: null, allergies: 'None', bloodType: 'AB+', enrollDate: '2021-09-01' },
  { id: 'STU005', name: 'Emma Wilson', grade: '12A', dob: '2008-09-14', gender: 'Female', email: 'emma@school.edu', phone: '+1-555-0108', parentName: 'James Wilson', parentPhone: '+1-555-0109', address: '654 Cedar Ln', status: 'Active', gpa: 4.0, photo: null, allergies: 'Gluten', bloodType: 'O-', enrollDate: '2018-09-01' },
  { id: 'STU006', name: 'Frank Brown', grade: '8B', dob: '2012-01-20', gender: 'Male', email: 'frank@school.edu', phone: '+1-555-0110', parentName: 'Linda Brown', parentPhone: '+1-555-0111', address: '987 Birch Blvd', status: 'Inactive', gpa: 2.5, photo: null, allergies: 'None', bloodType: 'A-', enrollDate: '2022-09-01' },
  { id: 'STU007', name: 'Grace Martinez', grade: '11B', dob: '2009-06-03', gender: 'Female', email: 'grace@school.edu', phone: '+1-555-0112', parentName: 'Carlos Martinez', parentPhone: '+1-555-0113', address: '147 Walnut Way', status: 'Active', gpa: 3.6, photo: null, allergies: 'None', bloodType: 'B-', enrollDate: '2019-09-01' },
  { id: 'STU008', name: 'Henry Taylor', grade: '9C', dob: '2011-12-11', gender: 'Male', email: 'henry@school.edu', phone: '+1-555-0114', parentName: 'Patricia Taylor', parentPhone: '+1-555-0115', address: '258 Spruce St', status: 'Active', gpa: 3.1, photo: null, allergies: 'Shellfish', bloodType: 'O+', enrollDate: '2021-09-01' },
]

// ─── STAFF ───────────────────────────────────────────────────────────────────
export const staff = [
  { id: 'STF001', name: 'Dr. Sarah Connor', role: 'Teacher', department: 'Mathematics', email: 'sconnor@school.edu', phone: '+1-555-0201', joinDate: '2015-08-15', status: 'Active', salary: 65000, subjects: ['Algebra', 'Calculus'], qualification: 'PhD Mathematics' },
  { id: 'STF002', name: 'Mr. John Doe', role: 'Teacher', department: 'Science', email: 'jdoe@school.edu', phone: '+1-555-0202', joinDate: '2018-08-20', status: 'Active', salary: 58000, subjects: ['Physics', 'Chemistry'], qualification: 'MSc Physics' },
  { id: 'STF003', name: 'Ms. Emily Rose', role: 'Teacher', department: 'English', email: 'erose@school.edu', phone: '+1-555-0203', joinDate: '2017-08-10', status: 'Active', salary: 56000, subjects: ['Literature', 'Grammar'], qualification: 'MA English' },
  { id: 'STF004', name: 'Mr. Tom Harris', role: 'Administrator', department: 'Administration', email: 'tharris@school.edu', phone: '+1-555-0204', joinDate: '2012-01-05', status: 'Active', salary: 72000, subjects: [], qualification: 'MBA' },
  { id: 'STF005', name: 'Ms. Nancy White', role: 'Librarian', department: 'Library', email: 'nwhite@school.edu', phone: '+1-555-0205', joinDate: '2016-03-01', status: 'Active', salary: 48000, subjects: [], qualification: 'MLIS' },
  { id: 'STF006', name: 'Mr. Kevin Black', role: 'Teacher', department: 'History', email: 'kblack@school.edu', phone: '+1-555-0206', joinDate: '2019-08-25', status: 'Active', salary: 55000, subjects: ['World History', 'Civics'], qualification: 'MA History' },
]

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const attendanceRecords = [
  { id: 1, studentId: 'STU001', studentName: 'Alice Johnson', date: '2026-05-19', status: 'Present', period: 'Full Day', class: '10A' },
  { id: 2, studentId: 'STU002', studentName: 'Brian Smith', date: '2026-05-19', status: 'Absent', period: 'Full Day', class: '10A' },
  { id: 3, studentId: 'STU003', studentName: 'Clara Davis', date: '2026-05-19', status: 'Present', period: 'Full Day', class: '11B' },
  { id: 4, studentId: 'STU004', studentName: 'David Lee', date: '2026-05-19', status: 'Late', period: 'Full Day', class: '9C' },
  { id: 5, studentId: 'STU005', studentName: 'Emma Wilson', date: '2026-05-19', status: 'Present', period: 'Full Day', class: '12A' },
  { id: 6, studentId: 'STU006', studentName: 'Frank Brown', date: '2026-05-19', status: 'Absent', period: 'Full Day', class: '8B' },
  { id: 7, studentId: 'STU007', studentName: 'Grace Martinez', date: '2026-05-19', status: 'Present', period: 'Full Day', class: '11B' },
  { id: 8, studentId: 'STU008', studentName: 'Henry Taylor', date: '2026-05-19', status: 'Present', period: 'Full Day', class: '9C' },
  { id: 9, studentId: 'STU001', studentName: 'Alice Johnson', date: '2026-05-18', status: 'Present', period: 'Full Day', class: '10A' },
  { id: 10, studentId: 'STU002', studentName: 'Brian Smith', date: '2026-05-18', status: 'Present', period: 'Full Day', class: '10A' },
]

// ─── GRADES ───────────────────────────────────────────────────────────────────
export const grades = [
  { id: 1, studentId: 'STU001', studentName: 'Alice Johnson', subject: 'Mathematics', assignment: 'Midterm Exam', score: 92, maxScore: 100, grade: 'A', date: '2026-04-15', teacher: 'Dr. Sarah Connor', term: 'Term 2' },
  { id: 2, studentId: 'STU001', studentName: 'Alice Johnson', subject: 'Science', assignment: 'Lab Report', score: 88, maxScore: 100, grade: 'B+', date: '2026-04-20', teacher: 'Mr. John Doe', term: 'Term 2' },
  { id: 3, studentId: 'STU002', studentName: 'Brian Smith', subject: 'Mathematics', assignment: 'Midterm Exam', score: 75, maxScore: 100, grade: 'C+', date: '2026-04-15', teacher: 'Dr. Sarah Connor', term: 'Term 2' },
  { id: 4, studentId: 'STU003', studentName: 'Clara Davis', subject: 'English', assignment: 'Essay', score: 95, maxScore: 100, grade: 'A', date: '2026-04-18', teacher: 'Ms. Emily Rose', term: 'Term 2' },
  { id: 5, studentId: 'STU004', studentName: 'David Lee', subject: 'History', assignment: 'Quiz 3', score: 68, maxScore: 100, grade: 'D+', date: '2026-04-22', teacher: 'Mr. Kevin Black', term: 'Term 2' },
  { id: 6, studentId: 'STU005', studentName: 'Emma Wilson', subject: 'Mathematics', assignment: 'Final Exam', score: 99, maxScore: 100, grade: 'A+', date: '2026-05-10', teacher: 'Dr. Sarah Connor', term: 'Term 2' },
  { id: 7, studentId: 'STU007', studentName: 'Grace Martinez', subject: 'Science', assignment: 'Project', score: 85, maxScore: 100, grade: 'B', date: '2026-05-05', teacher: 'Mr. John Doe', term: 'Term 2' },
]

// ─── ASSIGNMENTS ─────────────────────────────────────────────────────────────
export const assignments = [
  { id: 1, title: 'Quadratic Equations Worksheet', subject: 'Mathematics', class: '10A', dueDate: '2026-05-25', teacher: 'Dr. Sarah Connor', status: 'Active', submissions: 18, total: 25, description: 'Complete problems 1-20 from Chapter 5.' },
  { id: 2, title: 'Cell Biology Essay', subject: 'Science', class: '11B', dueDate: '2026-05-22', teacher: 'Mr. John Doe', status: 'Active', submissions: 12, total: 22, description: 'Write a 500-word essay on mitosis vs meiosis.' },
  { id: 3, title: 'Shakespeare Analysis', subject: 'English', class: '12A', dueDate: '2026-05-20', teacher: 'Ms. Emily Rose', status: 'Due Soon', submissions: 20, total: 20, description: 'Analyze the themes in Hamlet Act III.' },
  { id: 4, title: 'World War II Timeline', subject: 'History', class: '9C', dueDate: '2026-05-28', teacher: 'Mr. Kevin Black', status: 'Active', submissions: 5, total: 28, description: 'Create a detailed timeline of WWII events.' },
  { id: 5, title: 'Algebra Quiz Prep', subject: 'Mathematics', class: '8B', dueDate: '2026-05-21', teacher: 'Dr. Sarah Connor', status: 'Due Soon', submissions: 15, total: 20, description: 'Review chapters 3 and 4 for the upcoming quiz.' },
]

// ─── TIMETABLE ────────────────────────────────────────────────────────────────
export const timetable = {
  '10A': [
    { day: 'Monday', periods: [
      { time: '08:00-09:00', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101' },
      { time: '09:00-10:00', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102' },
      { time: '10:15-11:15', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1' },
      { time: '11:15-12:15', subject: 'History', teacher: 'Mr. Kevin Black', room: 'R103' },
      { time: '13:00-14:00', subject: 'PE', teacher: 'Coach Adams', room: 'Gym' },
    ]},
    { day: 'Tuesday', periods: [
      { time: '08:00-09:00', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1' },
      { time: '09:00-10:00', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101' },
      { time: '10:15-11:15', subject: 'History', teacher: 'Mr. Kevin Black', room: 'R103' },
      { time: '11:15-12:15', subject: 'Art', teacher: 'Ms. Green', room: 'Art1' },
      { time: '13:00-14:00', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102' },
    ]},
    { day: 'Wednesday', periods: [
      { time: '08:00-09:00', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102' },
      { time: '09:00-10:00', subject: 'History', teacher: 'Mr. Kevin Black', room: 'R103' },
      { time: '10:15-11:15', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101' },
      { time: '11:15-12:15', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1' },
      { time: '13:00-14:00', subject: 'Music', teacher: 'Mr. Piano', room: 'Music1' },
    ]},
    { day: 'Thursday', periods: [
      { time: '08:00-09:00', subject: 'History', teacher: 'Mr. Kevin Black', room: 'R103' },
      { time: '09:00-10:00', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1' },
      { time: '10:15-11:15', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102' },
      { time: '11:15-12:15', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101' },
      { time: '13:00-14:00', subject: 'PE', teacher: 'Coach Adams', room: 'Gym' },
    ]},
    { day: 'Friday', periods: [
      { time: '08:00-09:00', subject: 'Mathematics', teacher: 'Dr. Sarah Connor', room: 'R101' },
      { time: '09:00-10:00', subject: 'Art', teacher: 'Ms. Green', room: 'Art1' },
      { time: '10:15-11:15', subject: 'English', teacher: 'Ms. Emily Rose', room: 'R102' },
      { time: '11:15-12:15', subject: 'Science', teacher: 'Mr. John Doe', room: 'Lab1' },
      { time: '13:00-14:00', subject: 'Assembly', teacher: 'Admin', room: 'Hall' },
    ]},
  ]
}

// ─── FEES ─────────────────────────────────────────────────────────────────────
export const feeRecords = [
  { id: 'FEE001', studentId: 'STU001', studentName: 'Alice Johnson', grade: '10A', feeType: 'Tuition', amount: 2500, paid: 2500, balance: 0, dueDate: '2026-05-01', status: 'Paid', paymentDate: '2026-04-28', method: 'Card' },
  { id: 'FEE002', studentId: 'STU002', studentName: 'Brian Smith', grade: '10A', feeType: 'Tuition', amount: 2500, paid: 1000, balance: 1500, dueDate: '2026-05-01', status: 'Partial', paymentDate: '2026-04-30', method: 'Bank Transfer' },
  { id: 'FEE003', studentId: 'STU003', studentName: 'Clara Davis', grade: '11B', feeType: 'Tuition', amount: 2700, paid: 0, balance: 2700, dueDate: '2026-05-01', status: 'Overdue', paymentDate: null, method: null },
  { id: 'FEE004', studentId: 'STU004', studentName: 'David Lee', grade: '9C', feeType: 'Transport', amount: 500, paid: 500, balance: 0, dueDate: '2026-05-01', status: 'Paid', paymentDate: '2026-05-01', method: 'Mobile Money' },
  { id: 'FEE005', studentId: 'STU005', studentName: 'Emma Wilson', grade: '12A', feeType: 'Tuition', amount: 2800, paid: 2800, balance: 0, dueDate: '2026-05-01', status: 'Paid', paymentDate: '2026-04-25', method: 'Card' },
  { id: 'FEE006', studentId: 'STU006', studentName: 'Frank Brown', grade: '8B', feeType: 'Tuition', amount: 2300, paid: 0, balance: 2300, dueDate: '2026-04-01', status: 'Overdue', paymentDate: null, method: null },
  { id: 'FEE007', studentId: 'STU007', studentName: 'Grace Martinez', grade: '11B', feeType: 'Library', amount: 150, paid: 150, balance: 0, dueDate: '2026-05-01', status: 'Paid', paymentDate: '2026-04-29', method: 'Card' },
  { id: 'FEE008', studentId: 'STU008', studentName: 'Henry Taylor', grade: '9C', feeType: 'Tuition', amount: 2400, paid: 2400, balance: 0, dueDate: '2026-05-01', status: 'Paid', paymentDate: '2026-04-27', method: 'Bank Transfer' },
]

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const messages = [
  { id: 1, from: 'Dr. Sarah Connor', fromRole: 'Teacher', to: 'Robert Johnson', toRole: 'Parent', subject: 'Alice\'s Progress', body: 'Alice has been performing exceptionally well in Mathematics. Her midterm score was 92/100. Keep up the great work!', date: '2026-05-18', read: true, type: 'direct' },
  { id: 2, from: 'Admin', fromRole: 'Administrator', to: 'All', toRole: 'All', subject: 'School Sports Day - May 30', body: 'We are pleased to announce our Annual Sports Day on May 30, 2026. All students are encouraged to participate. Registration closes May 25.', date: '2026-05-17', read: false, type: 'announcement' },
  { id: 3, from: 'Mr. John Doe', fromRole: 'Teacher', to: 'Carol Smith', toRole: 'Parent', subject: 'Brian\'s Attendance', body: 'Brian was absent on May 19 without prior notice. Please ensure he brings a leave note when he returns.', date: '2026-05-19', read: false, type: 'direct' },
  { id: 4, from: 'Admin', fromRole: 'Administrator', to: 'All', toRole: 'All', subject: 'Term 2 Exam Schedule Released', body: 'The Term 2 examination schedule has been published. Please check the Academics section for details. Exams begin June 10.', date: '2026-05-15', read: true, type: 'announcement' },
  { id: 5, from: 'Ms. Emily Rose', fromRole: 'Teacher', to: 'Mark Davis', toRole: 'Parent', subject: 'Clara\'s Essay Award', body: 'Congratulations! Clara\'s essay on Shakespeare has been selected for the district writing competition. We are very proud of her.', date: '2026-05-16', read: true, type: 'direct' },
]

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
export const announcements = [
  { id: 1, title: 'Annual Sports Day - May 30', body: 'All students are encouraged to participate in our Annual Sports Day. Registration closes May 25.', date: '2026-05-17', author: 'Admin', priority: 'High', audience: 'All' },
  { id: 2, title: 'Term 2 Exam Schedule Released', body: 'The Term 2 examination schedule has been published. Exams begin June 10, 2026.', date: '2026-05-15', author: 'Academic Office', priority: 'High', audience: 'All' },
  { id: 3, title: 'Library Extended Hours', body: 'The library will be open until 7 PM on weekdays during exam preparation period (June 1-9).', date: '2026-05-14', author: 'Library', priority: 'Normal', audience: 'Students' },
  { id: 4, title: 'Parent-Teacher Meeting - June 5', body: 'The next Parent-Teacher meeting is scheduled for June 5, 2026 from 9 AM to 1 PM.', date: '2026-05-12', author: 'Admin', priority: 'Normal', audience: 'Parents' },
  { id: 5, title: 'New Cafeteria Menu', body: 'Starting June 1, the cafeteria will offer an expanded healthy menu. View the full menu on the school portal.', date: '2026-05-10', author: 'Admin', priority: 'Low', audience: 'All' },
]

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
export const libraryBooks = [
  { id: 'LIB001', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', category: 'Fiction', copies: 5, available: 3, location: 'Shelf A1' },
  { id: 'LIB002', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1-285-74155-0', category: 'Mathematics', copies: 8, available: 5, location: 'Shelf B2' },
  { id: 'LIB003', title: 'Biology: The Unity and Diversity of Life', author: 'Cecie Starr', isbn: '978-1-305-07327-1', category: 'Science', copies: 6, available: 6, location: 'Shelf C1' },
  { id: 'LIB004', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Fiction', copies: 4, available: 1, location: 'Shelf A2' },
  { id: 'LIB005', title: 'World History: Patterns of Interaction', author: 'Roger Beck', isbn: '978-0-547-49120-5', category: 'History', copies: 10, available: 7, location: 'Shelf D1' },
  { id: 'LIB006', title: 'Physics: Principles and Problems', author: 'Paul Zitzewitz', isbn: '978-0-07-845813-5', category: 'Science', copies: 7, available: 4, location: 'Shelf C2' },
  { id: 'LIB007', title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', category: 'Fiction', copies: 3, available: 0, location: 'Shelf A3' },
  { id: 'LIB008', title: 'The Elements of Style', author: 'Strunk & White', isbn: '978-0-205-30902-3', category: 'Reference', copies: 5, available: 5, location: 'Shelf E1' },
]

export const libraryIssues = [
  { id: 1, bookId: 'LIB001', bookTitle: 'To Kill a Mockingbird', studentId: 'STU001', studentName: 'Alice Johnson', issueDate: '2026-05-10', dueDate: '2026-05-24', returnDate: null, status: 'Issued' },
  { id: 2, bookId: 'LIB004', bookTitle: 'The Great Gatsby', studentId: 'STU003', studentName: 'Clara Davis', issueDate: '2026-05-05', dueDate: '2026-05-19', returnDate: null, status: 'Overdue' },
  { id: 3, bookId: 'LIB007', bookTitle: '1984', studentId: 'STU005', studentName: 'Emma Wilson', issueDate: '2026-05-01', dueDate: '2026-05-15', returnDate: null, status: 'Overdue' },
  { id: 4, bookId: 'LIB002', bookTitle: 'Calculus: Early Transcendentals', studentId: 'STU002', studentName: 'Brian Smith', issueDate: '2026-05-12', dueDate: '2026-05-26', returnDate: null, status: 'Issued' },
  { id: 5, bookId: 'LIB006', bookTitle: 'Physics: Principles and Problems', studentId: 'STU007', studentName: 'Grace Martinez', issueDate: '2026-04-28', dueDate: '2026-05-12', returnDate: '2026-05-11', status: 'Returned' },
]

// ─── EXAMS ────────────────────────────────────────────────────────────────────
export const exams = [
  { id: 1, name: 'Term 2 Mathematics Final', subject: 'Mathematics', class: '10A', date: '2026-06-10', time: '09:00-11:00', room: 'Hall A', invigilator: 'Dr. Sarah Connor', duration: 120, totalMarks: 100 },
  { id: 2, name: 'Term 2 Science Final', subject: 'Science', class: '11B', date: '2026-06-11', time: '09:00-11:00', room: 'Hall B', invigilator: 'Mr. John Doe', duration: 120, totalMarks: 100 },
  { id: 3, name: 'Term 2 English Final', subject: 'English', class: '12A', date: '2026-06-12', time: '09:00-11:00', room: 'Hall A', invigilator: 'Ms. Emily Rose', duration: 120, totalMarks: 100 },
  { id: 4, name: 'Term 2 History Final', subject: 'History', class: '9C', date: '2026-06-13', time: '13:00-15:00', room: 'Hall C', invigilator: 'Mr. Kevin Black', duration: 120, totalMarks: 100 },
  { id: 5, name: 'Term 2 Mathematics Final', subject: 'Mathematics', class: '8B', date: '2026-06-10', time: '13:00-15:00', room: 'Hall B', invigilator: 'Dr. Sarah Connor', duration: 120, totalMarks: 100 },
]

// ─── ANALYTICS SUMMARY ────────────────────────────────────────────────────────
export const analyticsSummary = {
  totalStudents: 342,
  totalStaff: 48,
  attendanceRate: 94.2,
  avgGPA: 3.4,
  feeCollectionRate: 78.5,
  activeClasses: 24,
  upcomingExams: 5,
  overdueBooks: 8,
  monthlyRevenue: [
    { month: 'Jan', amount: 85000 },
    { month: 'Feb', amount: 92000 },
    { month: 'Mar', amount: 88000 },
    { month: 'Apr', amount: 95000 },
    { month: 'May', amount: 78000 },
  ],
  attendanceByClass: [
    { class: '8B', rate: 91 },
    { class: '9C', rate: 93 },
    { class: '10A', rate: 96 },
    { class: '11B', rate: 95 },
    { class: '12A', rate: 97 },
  ],
  gradeDistribution: [
    { grade: 'A', count: 89 },
    { grade: 'B', count: 124 },
    { grade: 'C', count: 87 },
    { grade: 'D', count: 32 },
    { grade: 'F', count: 10 },
  ]
}
