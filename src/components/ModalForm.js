import React, { useEffect, useRef, useState } from "react";
import BottomSheet from "./BottomSheet";
import "./ModalForm.css";

const buildInitialState = (initialData) => ({
  title: initialData?.title || "",
  message: initialData?.message || "",
  image: null,
  previewUrl: initialData?.previewUrl || initialData?.imageUrl || null,
});

const ModalForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const formIdRef = useRef(
    `star-form-${Math.random().toString(36).slice(2, 9)}`
  );
  const baselineRef = useRef(buildInitialState(initialData));
  const [formData, setFormData] = useState(baselineRef.current);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const MAX_TITLE_LENGTH = 50;
  const MAX_MESSAGE_LENGTH = 1000;
  const isEditMode = Boolean(
    initialData?.title ||
      initialData?.message ||
      initialData?.previewUrl ||
      initialData?.imageUrl
  );

  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setHasAttemptedSubmit(false);
      setFormData(baselineRef.current);
      return;
    }

    const nextState = buildInitialState(initialData);
    baselineRef.current = nextState;
    setFormData(nextState);
    setErrors({});
    setHasAttemptedSubmit(false);
  }, [isOpen, initialData]);

  const isDirty =
    formData.title !== baselineRef.current.title ||
    formData.message !== baselineRef.current.message ||
    formData.previewUrl !== baselineRef.current.previewUrl ||
    Boolean(formData.image);

  const validate = () => {
    const nextErrors = {};
    if (!formData.title.trim()) {
      nextErrors.title = "Ingresa un título.";
    }
    if (!formData.message.trim()) {
      nextErrors.message = "Ingresa un mensaje.";
    }
    return nextErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const cleanData = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      image: formData.image,
    };

    const result = onSubmit?.(cleanData);
    if (result && typeof result.then === "function") {
      try {
        await result;
      } catch (error) {
        console.error("Error al guardar la estrella:", error);
      }
    }
  };

  const confirmDiscard = () => {
    if (!isDirty) return true;
    return window.confirm("Tienes cambios sin guardar. ¿Cerrar sin guardar?");
  };

  const handleRequestClose = () => {
    if (!confirmDiscard()) return;
    setFormData(baselineRef.current);
    setErrors({});
    setHasAttemptedSubmit(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const titleError = hasAttemptedSubmit ? errors.title : "";
  const messageError = hasAttemptedSubmit ? errors.message : "";
  const titleErrorId = `${formIdRef.current}-title-error`;
  const messageErrorId = `${formIdRef.current}-message-error`;
  const actions = (
    <>
      <button
        type="submit"
        form={formIdRef.current}
        className="modal-form__button modal-form__button--primary"
        aria-label="Guardar estrella"
      >
        Guardar
      </button>
      <button
        type="button"
        className="modal-form__button modal-form__button--ghost"
        onClick={handleRequestClose}
        aria-label="Cancelar"
      >
        Cancelar
      </button>
    </>
  );

  return (
    <BottomSheet
      open={isOpen}
      onClose={handleRequestClose}
      title={isEditMode ? "Editar estrella" : "Crear estrella"}
      actions={actions}
      footerSticky
    >
      <form
        id={formIdRef.current}
        className="modal-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="star-title">
            Título
          </label>
          <input
            type="text"
            id="star-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={MAX_TITLE_LENGTH}
            required
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? titleErrorId : undefined}
            className="modal-form__input"
          />
          <div className="modal-form__meta">
            <span
              id={titleErrorId}
              className="modal-form__error"
              aria-live="polite"
            >
              {titleError}
            </span>
            <span className="modal-form__counter">
              {formData.title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="star-message">
            Mensaje
          </label>
          <textarea
            id="star-message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            maxLength={MAX_MESSAGE_LENGTH}
            required
            aria-invalid={Boolean(messageError)}
            aria-describedby={messageError ? messageErrorId : undefined}
            className="modal-form__textarea"
          />
          <div className="modal-form__meta">
            <span
              id={messageErrorId}
              className="modal-form__error"
              aria-live="polite"
            >
              {messageError}
            </span>
            <span className="modal-form__counter">
              {formData.message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        <div className="modal-form__field">
          <label className="modal-form__label" htmlFor="star-image">
            Imagen
          </label>
          <label className="modal-form__file-label" htmlFor="star-image">
            <span>Seleccionar imagen</span>
          </label>
          <input
            type="file"
            id="star-image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="modal-form__file-input"
          />
          {formData.previewUrl ? (
            <div className="modal-form__preview">
              <img src={formData.previewUrl} alt="Vista previa de la imagen" />
            </div>
          ) : (
            <div className="modal-form__preview modal-form__preview--empty">
              <p>No se ha seleccionado ninguna imagen</p>
            </div>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};

export default ModalForm;
