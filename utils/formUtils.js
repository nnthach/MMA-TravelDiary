export const changeInputUtils = (setForm) => {
  return (value, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
};
