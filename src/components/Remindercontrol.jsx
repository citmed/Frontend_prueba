import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import '../styles/Remindercontrol.css';
import logo from "../assets/Logocitamed.png";

const Remindercontrol = () => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState(''); // AHORA LA HORA VA SEPARADA
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const irAReminder = () => {
    navigate('/reminder');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !hora) {
      alert('Debes seleccionar fecha y hora del control');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión nuevamente.");
      navigate("/login", { replace: true });
      return;
    }

    // Unimos fecha + hora (formato correcto para Date)
    const fechaControl = new Date(`${fecha}T${hora}`);
    const fechaRecordatorio = new Date(fechaControl.getTime() - 60 * 60 * 1000);

    const reminder = {
      tipo: "control",
      titulo,
      fecha: fechaControl,
      fechaRecordatorio,
      descripcion
    };

    try {
      setLoading(true);
      const response = await fetch("https://backend-prueba-three.vercel.app/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("✅ Recordatorio creado:", data);
        setTitulo('');
        setDescripcion('');
        setFecha('');
        setHora('');
        navigate("/reminder-created");
      } else {
        console.error("❌ Error al guardar recordatorio:", data.message);
        alert(`Hubo un problema al guardar: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("🚨 Error en la conexión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={irAReminder}>
          <FaArrowLeft />
        </button>
        <img
          src={logo}
          alt="Seguimiento y cumplimiento"
          className="milogo-medicine"
        />
      </nav>

      <main>
        <div className="remindercontrol-container">
          <div className="remindercontrol-banner">
            <h2 className="remindercontrol-subtitle">Crear recordatorio de control</h2>
          </div>

          <form className="remindercontrol-form" onSubmit={handleSubmit}>
            
            <label className="remindercontrol-label">Título</label>
            <input
              type="text"
              className="remindercontrol-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <label className="remindercontrol-label">Fecha del control</label>
            <input
              type="date"
              className="remindercontrol-fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />

            <label className="remindercontrol-label">Hora del control</label>
            <select
              className="remindercontrol-fecha"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            >
              <option value="">Seleccionar hora</option>
              <option value="00:00">00:00</option>
              <option value="00:15">00:15</option>
              <option value="00:30">00:30</option>
              <option value="00:45">00:45</option>
              <option value="01:00">01:00</option>
              <option value="01:15">01:15</option>
              <option value="01:30">01:30</option>
              <option value="01:45">01:45</option>
              <option value="02:00">02:00</option>
              <option value="02:15">02:15</option>
              <option value="02:30">02:30</option>
              <option value="02:45">02:45</option>
              {/* ⬆️ Puedes continuar hasta 23:45 si lo deseas */}
            </select>

            <label className="remindercontrol-label">Descripción</label>
            <textarea
              className="remindercontrol-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />

            <p className="remindercontrol-info">
              ❗ El recordatorio se enviará **1 hora antes** de la cita programada
            </p>

            <button
              type="submit"
              className="remindercontrol-submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Remindercontrol;
