import { useState, useEffect } from 'react';

function BookingForm() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceId: '',
    staffId: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (formData.staffId && formData.date && formData.serviceId) {
      fetchAvailableSlots();
    }
  }, [formData.staffId, formData.date, formData.serviceId]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Hizmetler yüklenemedi');
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      setStaff(data);
    } catch (err) {
      setError('Personel listesi yüklenemedi');
    }
  };

  const fetchAvailableSlots = async () => {
    const service = services.find(s => s.id === formData.serviceId);
    if (!service) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/available-slots?staffId=${formData.staffId}&date=${formData.date}&duration=${service.duration}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setError('Müsait saatler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceId, time: '' }));
    setAvailableSlots([]);
  };

  const handleStaffSelect = (staffId) => {
    setFormData(prev => ({ ...prev, staffId, time: '' }));
    setAvailableSlots([]);
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone || !formData.serviceId || 
        !formData.staffId || !formData.date || !formData.time) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Randevu oluşturulamadı');
      }

      const appointment = await response.json();
      setSuccess('Randevunuz başarıyla oluşturuldu! Telefon numaranızla randevularınızı görüntüleyebilirsiniz.');
      
      // Reset form
      setFormData({
        customerName: '',
        customerPhone: '',
        serviceId: '',
        staffId: '',
        date: '',
        time: ''
      });
      setStep(1);
      setAvailableSlots([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedStaff = staff.find(s => s.id === formData.staffId);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form">
      <h2>Randevu Oluştur</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Customer Information */}
        <div className="form-section">
          <h3>1. İletişim Bilgileri</h3>
          <div className="form-group">
            <label htmlFor="customerName">Adınız Soyadınız</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Örn: Ayşe Yılmaz"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerPhone">Telefon Numaranız</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              placeholder="Örn: 05551234567"
              pattern="[0-9]{11}"
              required
            />
          </div>
        </div>

        {/* Step 2: Service Selection */}
        <div className="form-section">
          <h3>2. Hizmet Seçimi</h3>
          <div className="services-grid">
            {services.map(service => (
              <div
                key={service.id}
                className={`service-card ${formData.serviceId === service.id ? 'selected' : ''}`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <h4>{service.name}</h4>
                <div className="duration">{service.duration} dakika</div>
                <div className="price">{service.price} ₺</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Staff Selection */}
        {formData.serviceId && (
          <div className="form-section">
            <h3>3. Personel Seçimi</h3>
            <div className="staff-grid">
              {staff.map(member => (
                <div
                  key={member.id}
                  className={`staff-card ${formData.staffId === member.id ? 'selected' : ''}`}
                  onClick={() => handleStaffSelect(member.id)}
                >
                  <div className="avatar">{member.avatar}</div>
                  <h4>{member.name}</h4>
                  <div className="specialty">{member.specialty}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Date Selection */}
        {formData.serviceId && formData.staffId && (
          <div className="form-section">
            <h3>4. Tarih Seçimi</h3>
            <div className="form-group">
              <label htmlFor="date">Randevu Tarihi</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>
          </div>
        )}

        {/* Step 5: Time Selection */}
        {formData.serviceId && formData.staffId && formData.date && (
          <div className="form-section">
            <h3>5. Saat Seçimi</h3>
            {loading ? (
              <div className="loading">Müsait saatler yükleniyor...</div>
            ) : availableSlots.length > 0 ? (
              <div className="time-slots">
                {availableSlots.map(slot => (
                  <div
                    key={slot}
                    className={`time-slot ${formData.time === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <div className="info-message">
                Bu tarihte müsait saat bulunmamaktadır. Lütfen farklı bir tarih seçin.
              </div>
            )}
          </div>
        )}

        {/* Summary and Submit */}
        {formData.time && (
          <div className="form-section">
            <h3>Randevu Özeti</h3>
            <div className="appointment-details">
              <div className="detail-item">
                <span className="detail-label">Hizmet</span>
                <span className="detail-value">{selectedService?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Personel</span>
                <span className="detail-value">{selectedStaff?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tarih</span>
                <span className="detail-value">{formData.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Saat</span>
                <span className="detail-value">{formData.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Süre</span>
                <span className="detail-value">{selectedService?.duration} dakika</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Ücret</span>
                <span className="detail-value">{selectedService?.price} ₺</span>
              </div>
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Randevu Oluşturuluyor...' : 'Randevuyu Onayla'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default BookingForm;
