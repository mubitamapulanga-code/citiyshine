import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as mock from '@/data/mockData'

export const useAppStore = defineStore('app', () => {
  const students = ref([...mock.students])
  const staff = ref([...mock.staff])
  const attendance = ref([...mock.attendanceRecords])
  const grades = ref([...mock.grades])
  const assignments = ref([...mock.assignments])
  const feeRecords = ref([...mock.feeRecords])
  const messages = ref([...mock.messages])
  const announcements = ref([...mock.announcements])
  const libraryBooks = ref([...mock.libraryBooks])
  const libraryIssues = ref([...mock.libraryIssues])
  const exams = ref([...mock.exams])
  const timetable = ref(mock.timetable)
  const analytics = ref(mock.analyticsSummary)
  const sidebarOpen = ref(true)
  const notifications = ref([
    { id: 1, text: 'Brian Smith marked absent today', type: 'warning', time: '10 min ago', read: false },
    { id: 2, text: 'New fee payment received from Emma Wilson', type: 'success', time: '1 hr ago', read: false },
    { id: 3, text: 'Library book overdue: The Great Gatsby', type: 'error', time: '2 hrs ago', read: true },
    { id: 4, text: 'Term 2 exam schedule published', type: 'info', time: '1 day ago', read: true },
  ])

  function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }

  function addStudent(student) {
    const id = `STU${String(students.value.length + 1).padStart(3, '0')}`
    students.value.push({ ...student, id, status: 'Active', gpa: 0 })
  }

  function updateStudent(id, data) {
    const idx = students.value.findIndex(s => s.id === id)
    if (idx !== -1) students.value[idx] = { ...students.value[idx], ...data }
  }

  function deleteStudent(id) {
    students.value = students.value.filter(s => s.id !== id)
  }

  function addStaff(member) {
    const id = `STF${String(staff.value.length + 1).padStart(3, '0')}`
    staff.value.push({ ...member, id, status: 'Active' })
  }

  function markAttendance(records) {
    records.forEach(r => {
      const existing = attendance.value.find(a => a.studentId === r.studentId && a.date === r.date)
      if (existing) {
        existing.status = r.status
      } else {
        attendance.value.push({ id: attendance.value.length + 1, ...r })
      }
    })
  }

  function addGrade(grade) {
    grades.value.push({ id: grades.value.length + 1, ...grade })
  }

  function addFeePayment(feeId, amount, method) {
    const fee = feeRecords.value.find(f => f.id === feeId)
    if (fee) {
      fee.paid += amount
      fee.balance = fee.amount - fee.paid
      fee.method = method
      fee.paymentDate = new Date().toISOString().split('T')[0]
      fee.status = fee.balance === 0 ? 'Paid' : 'Partial'
    }
  }

  function sendMessage(msg) {
    messages.value.unshift({ id: messages.value.length + 1, ...msg, date: new Date().toISOString().split('T')[0], read: false })
  }

  function markNotificationRead(id) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }

  function issueBook(issue) {
    libraryIssues.value.unshift({ id: libraryIssues.value.length + 1, ...issue, status: 'Issued' })
    const book = libraryBooks.value.find(b => b.id === issue.bookId)
    if (book && book.available > 0) book.available--
  }

  function returnBook(issueId) {
    const issue = libraryIssues.value.find(i => i.id === issueId)
    if (issue) {
      issue.status = 'Returned'
      issue.returnDate = new Date().toISOString().split('T')[0]
      const book = libraryBooks.value.find(b => b.id === issue.bookId)
      if (book) book.available++
    }
  }

  return {
    students, staff, attendance, grades, assignments, feeRecords,
    messages, announcements, libraryBooks, libraryIssues, exams,
    timetable, analytics, sidebarOpen, notifications,
    toggleSidebar, addStudent, updateStudent, deleteStudent,
    addStaff, markAttendance, addGrade, addFeePayment,
    sendMessage, markNotificationRead, issueBook, returnBook
  }
})
