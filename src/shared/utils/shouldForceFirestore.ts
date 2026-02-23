export const shouldForceFirestore = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("forceFirestore") === "true";
};
