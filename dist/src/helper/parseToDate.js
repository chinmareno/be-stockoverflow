function parseToDate(dateString) {
    const [month, day, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
}
export default parseToDate;
//# sourceMappingURL=parseToDate.js.map