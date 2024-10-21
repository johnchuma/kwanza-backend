const now = new Date();
const isThisWeek = (date) => {
  const today = new Date();
  const firstDayOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay())
  );
  firstDayOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight
  return date >= firstDayOfWeek;
};

const isThisMonth = (date) => {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const isThisYear = (date) => {
  return date.getFullYear() === now.getFullYear();
};

module.exports = {
  isThisWeek,
  isThisMonth,
  isThisYear,
};
