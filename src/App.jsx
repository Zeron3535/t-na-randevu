import { useState } from 'react';
import BookingForm from './components/BookingForm';
import MyAppointments from './components/MyAppointments';

function App() {
  const [activeTab, setActiveTab] = useState('booking');

  return (
    <div className="app">
      <header className="header">
        <h1>💇‍♀️ Tina Güzellik Salonu</h1>
        <p>Randevu Sistemi</p>
      </header>

      <nav className="navigation">
        <button
          className={`nav-button ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          Yeni Randevu Al
        </button>
        <button
          className={`nav-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Randevularım
        </button>
      </nav>

      <main className="content">
        {activeTab === 'booking' && <BookingForm />}
        {activeTab === 'appointments' && <MyAppointments />}
      </main>
    </div>
  );
}

export default App;
