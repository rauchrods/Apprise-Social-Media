export const getPostFormattedDate = (createdAt) => {
  const currentDate = new Date();
  const postDate = new Date(createdAt);
  const timeDiff = currentDate - postDate;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));

  if (hours < 24) {
    return `${hours} h`;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if (days < 7) {
    return `${days} d`;
  }

  const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
  if (weeks < 4) {
    return `${weeks} w`;
  }

  const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
  if (months < 12) {
    return `${months} m`;
  }

  const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
  return `${years} y`;
};

export const getUserFormattedDate = (createdAt) => {
  const postDate = new Date(createdAt);
  return postDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const trimObjectValues = (obj) => {
  // Handle non-objects or null
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const trimmedObject = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      trimmedObject[key] = value.trim();
    } else {
      trimmedObject[key] = value;
    }
  }

  return trimmedObject;
};
