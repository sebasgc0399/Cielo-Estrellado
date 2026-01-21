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
  const fileInputRef = useRef(null);
  const baselineRef = useRef(buildInitialState(initialData));
  const [formData, setFormData] = useState(baselineRef.current);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(false);
      setFormData(baselineRef.current);
      return;
    }

    const nextState = buildInitialState(initialData);
    baselineRef.current = nextState;
    setFormData(nextState);
    setErrors({});
    setHasAttemptedSubmit(false);
    setIsSaving(false);
  }, [isOpen, initialData]);

  const isDirty =
    formData.title !== baselineRef.current.title ||
    formData.message !== baselineRef.current.message ||
    formData.previewUrl !== baselineRef.current.previewUrl ||
    Boolean(formData.image);
  const isValid = Boolean(
    formData.title.trim() && formData.message.trim()
  );
  const titleCount = formData.title.length;
  const messageCount = formData.message.length;
  const titleWarn = titleCount >= MAX_TITLE_LENGTH - 5;
  const messageWarn = messageCount >= MAX_MESSAGE_LENGTH - 50;

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

  const handleFieldFocus = (event) => {
    window.setTimeout(() => {
      event.currentTarget.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }, 50);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: loadEvent.target?.result || null,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData((prev) => ({ ...prev, image: null, previewUrl: null }));
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (isSaving) return;
    setHasAttemptedSubmit(true);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const cleanData = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      image: formData.image,
    };

    setIsSaving(true);
    try {
      const result = onSubmit?.(cleanData);
      if (result && typeof result.then === "function") {
        await result;
      }
    } catch (error) {
      console.error("Error al guardar la estrella:", error);
    } finally {
      setIsSaving(false);
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
        type="button"
        className="btn btn--primary"
        onClick={handleSubmit}
        disabled={!isValid || isSaving}
        aria-label="Guardar estrella"
      >
        {isSaving ? "Guardando..." : "Guardar"}
      </button>
      <button
        type="button"
        className="btn btn--ghost"
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
      className="bottom-sheet--modal-form"
    >
      <form
        id={formIdRef.current}
        className="star-form"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <div className="form-group">
          <label className="label" htmlFor="star-title">
            Título
          </label>
          <input
            type="text"
            id="star-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onFocus={handleFieldFocus}
            maxLength={MAX_TITLE_LENGTH}
            required
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? titleErrorId : undefined}
            className="field"
          />
          <div className="meta">
            <span id={titleErrorId} className="error" aria-live="polite">
              {titleError}
            </span>
            <span
              className={`counter ${
                titleCount ? "counter--active" : ""
              } ${titleWarn ? "counter--warn" : ""}`}
            >
              {titleCount}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="label" htmlFor="star-message">
            Mensaje
          </label>
          <textarea
            id="star-message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            onFocus={handleFieldFocus}
            rows="4"
            maxLength={MAX_MESSAGE_LENGTH}
            required
            aria-invalid={Boolean(messageError)}
            aria-describedby={messageError ? messageErrorId : undefined}
            className="field field--textarea"
          />
          <div className="meta">
            <span id={messageErrorId} className="error" aria-live="polite">
              {messageError}
            </span>
            <span
              className={`counter ${
                messageCount ? "counter--active" : ""
              } ${messageWarn ? "counter--warn" : ""}`}
            >
              {messageCount}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>

        <div className="form-group">
          <span className="label">Imagen</span>
          <div className="image-field">
            {!formData.previewUrl ? (
              <label className="image-pick" htmlFor="star-image">
                <span className="image-pick__icon" aria-hidden="true">
                  +
                </span>
                <span className="image-pick__title">Imagen</span>
                <span className="image-pick__hint">Toca para seleccionar</span>
              </label>
            ) : (
              <div className="image-preview">
                <img src={formData.previewUrl} alt="Preview" />
                <div className="image-preview__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleChangeImage}
                    aria-label="Cambiar imagen"
                  >
                    Cambiar
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={handleRemoveImage}
                    aria-label="Quitar imagen"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              id="star-image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
          </div>
        </div>
      </form>
    </BottomSheet>
  );
};

export default ModalForm;
