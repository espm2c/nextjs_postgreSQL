export const formatDateToLocal = (
  dateStr,
  locale,
) => {
  const date = new Date(dateStr);
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};