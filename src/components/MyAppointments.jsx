import { useState, useEffect } from 'react';

function MyAppointments() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAppointments = async () => {
    // Turkish phone numbers are 11 digits (e.g., 05551234567)
    if (!phone || phone.length !== 11) {
      setError('Lütfen geçerli bir telefon numarası girin (11 haneli)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/appointments/${phone}`);
      const data = await response.json();
      setAppointments(data);
      if (data.length === 0) {
        setError('Bu telefon numarasına kayıtlı randevu bulunamadı.');
      }
    } catch (err) {
      setError('Randevular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Randevu iptal edilemedi');
      }

      setSuccess('Randevu başarıyla iptal edildi');
      
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPastAppointment = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime < new Date();
  };

  return (
    <div className="my-appointments">
      <h2>Randevularım</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="phone-lookup">
        <div className="form-group">
          <label htmlFor="phone">Telefon Numaranız</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
              setSuccess('');
            }}
            placeholder="Örn: 05551234567"
            pattern="[0-9]{11}"
          />
        </div>
        <button
          className="action-button"
          onClick={fetchAppointments}
          disabled={loading}
        >
          {loading ? 'Yükleniyor...' : 'Randevularımı Göster'}
        </button>
      </div>

      {appointments.length > 0 && (
        <div className="appointments-list">
          <h3>Randevularınız ({appointments.length})</h3>
          {appointments.map(appointment => {
            const isPast = isPastAppointment(appointment.date, appointment.time);
            const isCancelled = appointment.status === 'cancelled';

            return (
              <div
                key={appointment.id}
                className={`appointment-card ${isCancelled ? 'cancelled' : ''}`}
              >
                <div className="appointment-header">
                  <h4>{appointment.serviceName}</h4>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status === 'confirmed' ? 'Onaylı' : 'İptal Edildi'}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-label">Personel</span>
                    <span className="detail-value">{appointment.staffName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tarih</span>
                    <span className="detail-value">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Saat</span>
                    <span className="detail-value">{appointment.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Süre</span>
                    <span className="detail-value">{appointment.duration} dakika</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ücret</span>
                    <span className="detail-value">{appointment.price} ₺</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Müşteri</span>
                    <span className="detail-value">{appointment.customerName}</span>
                  </div>
                </div>

                {!isCancelled && !isPast && (
                  <div className="appointment-actions">
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel(appointment.id)}
                      disabled={loading}
                    >
                      Randevuyu İptal Et
                    </button>
                  </div>
                )}

                {isPast && !isCancelled && (
                  <div className="info-message">
                    Bu randevu tarihi geçmiştir.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
