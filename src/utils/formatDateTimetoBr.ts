export const formatDateTimeBR = (
  dateString: string
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("pt-BR");
};