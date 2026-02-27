export const isFirestoreTest = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("firestoreTest") === "true";
};
