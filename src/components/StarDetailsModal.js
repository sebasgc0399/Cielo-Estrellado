import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StarDetailsModal.css";

const StarDetailsModal = ({ isOpen, onClose, star, onEdit, onDelete }) => {
  const [editableStar, setEditableStar] = useState(star);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false); // Estado para el zoom de imagen

  const MAX_TITLE_LENGTH = 50; // Máximo de caracteres para el título
  const MAX_MESSAGE_LENGTH = 1000; // Máximo de caracteres para el mensaje

  // Actualiza los datos locales cuando se selecciona una nueva estrella
  useEffect(() => {
    if (star) {
      setEditableStar({ ...star }); // Asegúrate de clonar el objeto correctamente
    }
    setIsEditing(false);
  }, [star]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limitar los caracteres según el campo
    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setEditableStar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditableStar((prev) => ({ ...prev, newImage: file })); // Almacenar nueva imagen
    }
  };

  const handleRemoveImage = () => {
    setEditableStar((prev) => ({ ...prev, image: null, newImage: null }));
  };

  const handleSave = () => {
    const updatedStar = {
      ...editableStar,
      newImage: editableStar.newImage || null, // Nueva imagen si existe
      image: editableStar.newImage ? null : editableStar.image, // Si hay nueva imagen, omitir la actual
    };
  
    // Eliminar la imagen si no hay ninguna seleccionada
    if (!editableStar.image && !editableStar.newImage) {
      updatedStar.image = null;
    } else if (!editableStar.newImage) {
      // No enviar clave 'image' si no es necesario
      delete updatedStar.image;
    }
  
    onEdit(updatedStar); // Llama al método para manejar la edición en App.js
    setIsEditing(false);
  };
  
  

  const handleDelete = (id) => {
    try {
      onDelete(id); // Llama al método para manejar la eliminación
      onClose(); // Cierra el modal después de eliminar
      toast.success("Estrella eliminada con éxito!"); // Mensaje de éxito
    } catch (error) {
      console.error("Error al eliminar estrella:", error);
      toast.error("Error al eliminar estrella."); // Mensaje de error
    }
  };

  if (!isOpen || !star) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target.className === "modal-overlay" && onClose()}
    >
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          ×
        </span>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editableStar?.title || ""}
              onChange={handleInputChange}
              maxLength={MAX_TITLE_LENGTH} // Limita los caracteres
              placeholder="Título"
            />
            <p className="char-counter">
              {editableStar.title.length}/{MAX_TITLE_LENGTH} caracteres
            </p>
          </>
        ) : (
          <h2>{editableStar?.title}</h2>
        )}

        {isEditing ? (
          <>
            <textarea
              name="message"
              value={editableStar?.message || ""}
              onChange={handleInputChange}
              maxLength={MAX_MESSAGE_LENGTH} // Limita los caracteres
              rows="4"
              placeholder="Mensaje"
            />
            <p className="char-counter">
              {editableStar.message.length}/{MAX_MESSAGE_LENGTH} caracteres
            </p>
          </>
        ) : (
          <p>{editableStar?.message || "Cargando información de la estrella..."}</p>
        )}

        {editableStar?.image && (
          <div className="image-container">
            <img
              src={editableStar.image}
              alt={editableStar.title}
              onClick={() => setIsImageZoomed(true)}
              className="zoomable-image"
            />
            <div className="zoom-icon-overlay" onClick={() => setIsImageZoomed(true)}>
              🔍
            </div>
            {isEditing && (
              <button onClick={handleRemoveImage} className="remove-image-button">
                Quitar Imagen
              </button>
            )}
          </div>
        )}

        {isEditing && (
          <label className="image-label">
            Cambiar Imagen:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </label>
        )}

        <div className="modal-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Guardar Cambios</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Editar</button>
              <button onClick={() => handleDelete(star.id)}>Eliminar</button>
            </>
          )}
        </div>
      </div>

      {isImageZoomed && (
        <div className="image-zoom-modal" onClick={() => setIsImageZoomed(false)}>
          <img src={editableStar.image} alt="Zoom de imagen" />
        </div>
      )}
    </div>
  );
};

export default StarDetailsModal;
