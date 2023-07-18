function parseToDate(dateString: string) {
  const [month, day, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`);
}
export default parseToDate;
