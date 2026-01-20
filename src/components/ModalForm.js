import React, { useState } from "react";
import "./ModalForm.css";
import '@fortawesome/fontawesome-free/css/all.css';


const ModalForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: null,
    previewUrl: null,
  });

  const MAX_TITLE_LENGTH = 50; // Máximo de caracteres para el título
  const MAX_MESSAGE_LENGTH = 1000; // Máximo de caracteres para el mensaje

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limitar el número de caracteres según el campo
    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: file, previewUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null, previewUrl: null }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un nuevo objeto con solo los datos necesarios
    const { title, message, image } = formData;
    const cleanData = { title, message, image };

    // Enviar los datos necesarios al backend o función de procesamiento
    onSubmit(cleanData);

    resetForm(); // Limpia el formulario
    onClose(); // Cierra el modal
  };

  // Manejar el clic fuera del modal para cerrarlo
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      resetForm(); // Limpia el formulario
      onClose(); // Cierra el modal
    }
  };

  // Función para reiniciar el formulario
  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      image: null,
      previewUrl: null,
    });
  };

  if (!isOpen) return null; // No renderiza nada si el modal no está abierto

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        <h2>Añadir una nueva estrella</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={MAX_TITLE_LENGTH} // Atributo para limitar los caracteres
            required
          />
          <p className="char-counter">
            {formData.title.length}/{MAX_TITLE_LENGTH} caracteres
          </p>
          <label htmlFor="message">Mensaje:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            maxLength={MAX_MESSAGE_LENGTH} // Atributo para limitar los caracteres
            required
          />
          <p className="char-counter">
            {formData.message.length}/{MAX_MESSAGE_LENGTH} caracteres
          </p>
          <label htmlFor="image" className="image-label">
            <span>Haz clic para seleccionar una imagen</span>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </label>
          {formData.previewUrl ? (
            <div className="image-preview-scrollable">
              <img src={formData.previewUrl} alt="Previsualización de la imagen" />
            </div>
          ) : (
            <div className="image-preview">
              <p>No se ha seleccionado ninguna imagen</p>
            </div>
          )}
          <button type="submit" className="submit-button">
            Guardar Estrella
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;