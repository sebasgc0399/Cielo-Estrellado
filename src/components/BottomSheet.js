import React, { useEffect, useRef, useState } from "react";
import "./BottomSheet.css";

const HEIGHT_CLASSES = {
  70: "bottom-sheet--size-70",
  80: "bottom-sheet--size-80",
  85: "bottom-sheet--size-85",
};

const BottomSheet = ({
  open,
  onClose,
  title,
  size = 80,
  actions,
  footerSticky = false,
  children,
}) => {
  const sheetRef = useRef(null);
  const lastActiveRef = useRef(null);
  const titleIdRef = useRef(
    `bottom-sheet-title-${Math.random().toString(36).slice(2, 9)}`
  );
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    if (!open) return undefined;
    setDragOffset(0);
    dragOffsetRef.current = 0;
    lastActiveRef.current = document.activeElement;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      sheetRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      if (lastActiveRef.current?.focus) {
        lastActiveRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    setIsDragging(true);
    startYRef.current = event.clientY;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientY - startYRef.current;
    const nextOffset = delta > 0 ? delta : 0;
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const handlePointerUp = (event) => {
    if (!isDragging) return;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (dragOffsetRef.current > 120) {
      dragOffsetRef.current = 0;
      setDragOffset(0);
      onClose?.();
      return;
    }
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const sizeClass = HEIGHT_CLASSES[size] || HEIGHT_CLASSES[80];
  const contentClassName = actions
    ? "bottom-sheet__content"
    : "bottom-sheet__content bottom-sheet__content--safe";

  return (
    <div className="bottom-sheet__backdrop" onClick={handleBackdropClick}>
      <div
        className={`bottom-sheet ${sizeClass} ${
          isDragging ? "is-dragging" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        aria-label={!title ? "Detalle" : undefined}
        tabIndex={-1}
        ref={sheetRef}
        style={{ "--sheet-offset": `${dragOffset}px` }}
      >
        <div
          className="bottom-sheet__handle"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span className="bottom-sheet__grab" />
        </div>
        <div className="bottom-sheet__header">
          {title ? (
            <h2 id={titleIdRef.current} className="bottom-sheet__title">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="bottom-sheet__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            X
          </button>
        </div>
        <div className={contentClassName}>
          {children}
          {!footerSticky && actions && (
            <div className="bottom-sheet__actions">{actions}</div>
          )}
        </div>
        {footerSticky && actions && (
          <div className="bottom-sheet__actions bottom-sheet__actions--sticky">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSheet;
