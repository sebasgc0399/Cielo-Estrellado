import React, { useState, useEffect, useRef } from "react";
import ShootingStars from "./ShootingStars";
import BackgroundStars from "./BackgroundStars";
import FloatingButton from "./FloatingButton";
import ModalForm from "./ModalForm";
import InteractiveStar from "./InteractiveStar";
import StarDetailsModal from "./StarDetailsModal";
import { createStar, fetchStars, deleteStar, updateStar } from "../api";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../App.css";

const MainApp = ({ currentUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [stars, setStars] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Año seleccionado
  const [showYearMenu, setShowYearMenu] = useState(false); // Controla el menú desplegable
  const [selectorPosition, setSelectorPosition] = useState("right"); // Estado para manejar la posición del selector
  const skyRef = useRef(null);

  const years = Array.from({ length: 2100 - 2024 + 1 }, (_, index) => 2024 + index); // Generar años 2024-2100

  useEffect(() => {
    const loadStars = async () => {
      try {
        const data = await fetchStars(selectedYear); // Cargar estrellas del año seleccionado
        setStars(data);
      } catch (error) {
        console.error("Error al cargar estrellas:", error);
      }
    };

    loadStars();
  }, [selectedYear]); // Volver a cargar estrellas cuando el año cambie

  const handleYearChange = (year) => {
    setSelectedYear(year); // Cambiar el año seleccionado
    setShowYearMenu(false); // Cerrar el menú
  };

  const togglePosition = () => {
    setSelectorPosition((prev) => (prev === "right" ? "left" : "right")); // Cambia entre izquierda y derecha
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleStarClick = (star) => {
    setSelectedStar(star);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedStar(null);
    setDetailsModalOpen(false);
  };

  const handleFormSubmit = async (data) => {
    const completeData = { ...data, createdBy: currentUser.uid }; // No enviamos x, y
    try {
      const result = await createStar(completeData); // El backend devuelve las coordenadas
      setStars((prevStars) => [
        ...prevStars,
        { ...result, id: result.id }, // Usa las coordenadas devueltas por el backend
      ]);
      setModalOpen(false);
      toast.success("Estrella creada con éxito!");
    } catch (error) {
      console.error("Error al crear estrella:", error);
      toast.error("No se pudo crear la estrella o ya creaste una estrella el día de hoy");
    }
  };

  const handleEditStar = async (updatedStar) => {
    try {
      const result = await updateStar(updatedStar);
      setStars((prevStars) =>
        prevStars.map((star) =>
          star.id === updatedStar.id ? { ...star, ...updatedStar, image: result.image } : star
        )
      );
      handleCloseDetailsModal();
    } catch (error) {
      console.error("Error al editar estrella:", error);
    }
  };

  const handleDeleteStar = async (id) => {
    try {
      await deleteStar(id);
      setStars((prevStars) => prevStars.filter((star) => star.id !== id));
      handleCloseDetailsModal();
    } catch (error) {
      console.error("Error al eliminar estrella:", error);
    }
  };

  return (
    <div className="app" ref={skyRef}>
      <div className={`year-selector-container ${selectorPosition}`}>
        <button
          className="year-selector-button"
          onClick={() => setShowYearMenu((prev) => !prev)}
        >
          Año: {selectedYear} ⬇
        </button>
        {showYearMenu && (
          <div className="year-menu">
            {years.map((year) => (
              <div
                key={year}
                className="year-option"
                onClick={() => handleYearChange(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}
        <button className="toggle-position-button" onClick={togglePosition}>
          ⇆
        </button>
      </div>
      <div className="sky">
        <BackgroundStars />
      </div>
      <div className="shooting-sky">
        <ShootingStars />
      </div>
      {stars.map((star) => (
        <InteractiveStar
          key={star.id}
          x={star.x}
          y={star.y}
          title={`${star.title} (${star.createdBy === currentUser.uid ? "Sebastian" : "Sofia"})`}
          message={star.message}
          imageUrl={star.image}
          onClick={() => handleStarClick(star)}
        />
      ))}
      <FloatingButton onClick={handleOpenModal} />
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
      <StarDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        star={selectedStar}
        onEdit={(star) => handleEditStar(star)}
        onDelete={(star) => handleDeleteStar(star)}
      />
      <ToastContainer position="bottom-right" autoClose={3500} />
    </div>
  );
};

export default MainApp;
