const toLocaleDate = (date: any) => {
  const det = new Date(date);
  const localDateString = det.toLocaleDateString();
  return localDateString;
};
export default toLocaleDate;
