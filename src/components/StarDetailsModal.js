import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomSheet from "./BottomSheet";
import "./StarDetailsModal.css";

const StarDetailsModal = ({ isOpen, onClose, star, onEdit, onDelete }) => {
  const [editableStar, setEditableStar] = useState(star);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const MAX_TITLE_LENGTH = 50; // Máximo de caracteres para el título
  const MAX_MESSAGE_LENGTH = 1000; // Máximo de caracteres para el mensaje

  // Actualiza los datos locales cuando se selecciona una nueva estrella
  useEffect(() => {
    if (star) {
      setEditableStar({ ...star });
    }
    setIsEditing(false);
    setIsImageZoomed(false);
  }, [star]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setEditableStar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditableStar((prev) => ({ ...prev, newImage: file }));
    }
  };

  const handleRemoveImage = () => {
    setEditableStar((prev) => ({ ...prev, image: null, newImage: null }));
  };

  const handleSave = () => {
    const updatedStar = {
      ...editableStar,
      newImage: editableStar.newImage || null,
      image: editableStar.newImage ? null : editableStar.image,
    };

    if (!editableStar.image && !editableStar.newImage) {
      updatedStar.image = null;
    } else if (!editableStar.newImage) {
      delete updatedStar.image;
    }

    onEdit(updatedStar);
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    try {
      onDelete(id);
      onClose();
      toast.success("Estrella eliminada con éxito!");
    } catch (error) {
      console.error("Error al eliminar estrella:", error);
      toast.error("Error al eliminar estrella.");
    }
  };

  if (!isOpen || !star) return null;

  const titleLength = editableStar?.title ? editableStar.title.length : 0;
  const messageLength = editableStar?.message ? editableStar.message.length : 0;
  const actions = isEditing ? (
    <>
      <button
        type="button"
        className="star-details__button star-details__button--primary"
        onClick={handleSave}
      >
        Guardar cambios
      </button>
      <button
        type="button"
        className="star-details__button star-details__button--ghost"
        onClick={() => setIsEditing(false)}
      >
        Cancelar
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        className="star-details__button star-details__button--primary"
        onClick={() => setIsEditing(true)}
      >
        Editar
      </button>
      <button
        type="button"
        className="star-details__button star-details__button--danger"
        onClick={() => handleDelete(star.id)}
      >
        Eliminar
      </button>
    </>
  );

  return (
    <>
      <BottomSheet
        open={isOpen}
        onClose={onClose}
        title={isEditing ? "Editar estrella" : "Detalle de estrella"}
        actions={actions}
        footerSticky
      >
        <div className="star-details">
          {isEditing ? (
            <div className="star-details__field-group">
              <label className="star-details__label" htmlFor="star-title">
                Título
              </label>
              <input
                id="star-title"
                type="text"
                name="title"
                value={editableStar?.title || ""}
                onChange={handleInputChange}
                maxLength={MAX_TITLE_LENGTH}
                className="star-details__field"
              />
              <p className="star-details__counter">
                {titleLength}/{MAX_TITLE_LENGTH} caracteres
              </p>
            </div>
          ) : (
            <h2 className="star-details__title">
              {editableStar?.title || "Sin título"}
            </h2>
          )}

          {isEditing ? (
            <div className="star-details__field-group">
              <label className="star-details__label" htmlFor="star-message">
                Mensaje
              </label>
              <textarea
                id="star-message"
                name="message"
                value={editableStar?.message || ""}
                onChange={handleInputChange}
                maxLength={MAX_MESSAGE_LENGTH}
                rows="4"
                className="star-details__field"
              />
              <p className="star-details__counter">
                {messageLength}/{MAX_MESSAGE_LENGTH} caracteres
              </p>
            </div>
          ) : (
            <p className="star-details__message">
              {editableStar?.message ||
                "Cargando información de la estrella..."}
            </p>
          )}

          {editableStar?.image && (
            <div className="image-container">
              <img
                src={editableStar.image}
                alt={editableStar.title || "Estrella"}
                onClick={() => setIsImageZoomed(true)}
                className="zoomable-image"
              />
              <div
                className="zoom-icon-overlay"
                onClick={() => setIsImageZoomed(true)}
              >
                Zoom
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-button"
                >
                  Quitar imagen
                </button>
              )}
            </div>
          )}

          {isEditing && (
            <label className="image-label">
              <span>Cambiar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
            </label>
          )}
        </div>
      </BottomSheet>

      {isImageZoomed && (
        <div
          className="image-zoom-modal"
          onClick={() => setIsImageZoomed(false)}
        >
          <img src={editableStar.image} alt="Zoom de imagen" />
        </div>
      )}
    </>
  );
};

export default StarDetailsModal;
