// api.js

const API_URL = "https://cieloestrellado.vercel.app";

/**
 * Envía los datos del formulario al backend para crear una nueva estrella.
 * @param {Object} data - Datos del formulario (title, message, image, x, y).
 */
export const createStar = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("message", data.message);
  formData.append("createdBy", data.createdBy); // Asegúrate de enviar el UID del usuario
  if (data.image) {
    formData.append("image", data.image);
  }

  try {
    const response = await fetch(`${API_URL}/stars`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.error || "Error al enviar los datos al backend");
    }

    const result = await response.json();
    return result; // Devuelve el resultado con id, x, y e imagen
  } catch (error) {
    console.error("Error al guardar la estrella:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};


/**
 * Suscribe un token de FCM a un tópico.
 * @param {string} token - Token del cliente registrado en FCM.
 * @param {string} topic - Nombre del tópico al que se suscribe.
 */
export const subscribeToTopic = async (token, topic) => {
  try {
    const response = await fetch(`${API_URL}/suscribir-a-topico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error("Error al suscribirse al tópico");
    }

    console.log(`Suscripción exitosa al tópico: ${topic}`);
  } catch (error) {
    console.error("Error en la suscripción al tópico:", error);
  }
};

// Obtener todas las estrellas desde el backend
export const fetchStars = async (year) => {
  try {
    const response = await fetch(`${API_URL}/stars?year=${year}`);
    if (!response.ok) {
      throw new Error("Error al obtener las estrellas");
    }
    const stars = await response.json();
    return stars;
  } catch (error) {
    console.error("Error al cargar las estrellas desde el backend:", error);
    throw error;
  }
};


export const deleteStar = async (id) => {
  const response = await fetch(`${API_URL}/stars/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Error al eliminar la estrella");
  }
};

export const updateStar = async (updatedStar) => {
  const formData = new FormData();
  formData.append("title", updatedStar.title);
  formData.append("message", updatedStar.message);
  formData.append("x", updatedStar.x);
  formData.append("y", updatedStar.y);

  // Adjuntar solo si hay una nueva imagen
  if (updatedStar.newImage) {
    formData.append("image", updatedStar.newImage);
  } else if (updatedStar.image === null) {
    // Si la imagen fue eliminada explícitamente
    formData.append("image", "");
  }

  const response = await fetch(`${API_URL}/stars/${updatedStar.id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la estrella");
  }
  return response.json();
};
