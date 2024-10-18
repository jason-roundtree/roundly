export default function formatDateForInput(date) {
  const dateObject = new Date(date)
  return `${dateObject.getFullYear()}-${(
    '0' +
    (dateObject.getMonth() + 1)
  ).slice(-2)}-${('0' + dateObject.getDate()).slice(-2)}`
}
