const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
const services = [
  { id: '1', name: 'Saç Kesimi', duration: 30, price: 150 },
  { id: '2', name: 'Saç Boyama', duration: 120, price: 500 },
  { id: '3', name: 'Manikür', duration: 45, price: 100 },
  { id: '4', name: 'Pedikür', duration: 60, price: 150 },
  { id: '5', name: 'Cilt Bakımı', duration: 90, price: 400 },
  { id: '6', name: 'Makyaj', duration: 60, price: 300 },
  { id: '7', name: 'Kaş Tasarımı', duration: 30, price: 80 },
  { id: '8', name: 'Kirpik Lifting', duration: 45, price: 200 }
];

const staff = [
  { id: '1', name: 'Ayşe Yılmaz', specialty: 'Saç Uzmanı', avatar: '👩‍🦰' },
  { id: '2', name: 'Fatma Demir', specialty: 'Cilt Bakım Uzmanı', avatar: '👩' },
  { id: '3', name: 'Zeynep Kaya', specialty: 'Manikür & Pedikür', avatar: '👩‍🦱' },
  { id: '4', name: 'Elif Şahin', specialty: 'Makyaj Uzmanı', avatar: '👱‍♀️' }
];

// Appointments storage
let appointments = [];

// Helper function to check if a time slot is available
function isTimeSlotAvailable(staffId, date, startTime, duration, excludeAppointmentId = null) {
  const requestedStart = new Date(`${date}T${startTime}`);
  const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

  return !appointments.some(apt => {
    // Skip the appointment being updated
    if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
    
    if (apt.staffId !== staffId || apt.date !== date) return false;
    
    const aptStart = new Date(`${apt.date}T${apt.time}`);
    const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);

    return (requestedStart < aptEnd && requestedEnd > aptStart);
  });
}

// Get available time slots for a specific staff member and date
function getAvailableTimeSlots(staffId, date, duration) {
  const slots = [];
  const workStart = 9; // 9 AM
  const workEnd = 18; // 6 PM
  
  for (let hour = workStart; hour < workEnd; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      // Check if this slot would end before work hours end
      const slotEnd = hour * 60 + minute + duration;
      if (slotEnd > workEnd * 60) continue;
      
      if (isTimeSlotAvailable(staffId, date, timeStr, duration)) {
        slots.push(timeStr);
      }
    }
  }
  
  return slots;
}

// API Routes

// Get all services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// Get all staff
app.get('/api/staff', (req, res) => {
  res.json(staff);
});

// Get available time slots
app.get('/api/available-slots', (req, res) => {
  const { staffId, date, duration } = req.query;
  
  if (!staffId || !date || !duration) {
    return res.status(400).json({ error: 'staffId, date, and duration are required' });
  }
  
  const slots = getAvailableTimeSlots(staffId, date, parseInt(duration));
  res.json(slots);
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const { customerName, customerPhone, serviceId, staffId, date, time } = req.body;
  
  if (!customerName || !customerPhone || !serviceId || !staffId || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const service = services.find(s => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  const staffMember = staff.find(s => s.id === staffId);
  if (!staffMember) {
    return res.status(404).json({ error: 'Staff member not found' });
  }
  
  // Check availability
  if (!isTimeSlotAvailable(staffId, date, time, service.duration)) {
    return res.status(409).json({ error: 'Time slot is not available' });
  }
  
  const appointment = {
    id: uuidv4(),
    customerName,
    customerPhone,
    serviceId,
    serviceName: service.name,
    staffId,
    staffName: staffMember.name,
    date,
    time,
    duration: service.duration,
    price: service.price,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(appointment);
  res.status(201).json(appointment);
});

// Get appointments by phone number
app.get('/api/appointments/:phone', (req, res) => {
  const { phone } = req.params;
  const userAppointments = appointments.filter(apt => apt.customerPhone === phone);
  res.json(userAppointments);
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { date, time, staffId } = req.body;
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  
  const appointment = appointments[appointmentIndex];
  
  // If changing time or staff, check availability
  if ((date && date !== appointment.date) || 
      (time && time !== appointment.time) || 
      (staffId && staffId !== appointment.staffId)) {
    
    const newStaffId = staffId || appointment.staffId;
    const newDate = date || appointment.date;
    const newTime = time || appointment.time;
    
    // Check availability, excluding the current appointment
    if (!isTimeSlotAvailable(newStaffId, newDate, newTime, appointment.duration, id)) {
      return res.status(409).json({ error: 'Time slot is not available' });
    }
  }
  
  // Update appointment
  if (date) appointment.date = date;
  if (time) appointment.time = time;
  if (staffId) {
    const newStaff = staff.find(s => s.id === staffId);
    if (newStaff) {
      appointment.staffId = staffId;
      appointment.staffName = newStaff.name;
    }
  }
  
  res.json(appointment);
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  
  const appointment = appointments[appointmentIndex];
  appointment.status = 'cancelled';
  
  res.json({ message: 'Appointment cancelled successfully', appointment });
});

app.listen(PORT, () => {
  console.log(`Tina Beauty Salon API server running on http://localhost:${PORT}`);
});
