export const formatMoney = (n) => {
  const num = Number(n) || 0;
  // 250000 -> "250 000 so'm" (NBSP/vergulni oddiy probelga almashtiramiz)
  return `${num.toLocaleString("uz-UZ").replace(/[\s,]/g, " ")} so'm`;
};
