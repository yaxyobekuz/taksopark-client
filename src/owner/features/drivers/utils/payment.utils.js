// Kunlik plan holatini (label + rang) DERIVED qiymatlardan aniqlaydi.
export const planStatus = (plan) => {
  if (!plan) return { key: "none", label: "-", className: "bg-gray-100 text-gray-600" };
  if (plan.isRestDay) {
    return { key: "rest", label: "Dam olish", className: "bg-amber-50 text-amber-700" };
  }
  if (plan.priceMissing) {
    return { key: "noPrice", label: "Narx yo'q", className: "bg-gray-100 text-gray-600" };
  }
  const paid = plan.paidAmount || 0;
  const debt = plan.debt || 0;
  if (debt === 0 && paid > 0) {
    return { key: "paid", label: "To'langan", className: "bg-green-50 text-green-700" };
  }
  if (paid > 0) {
    return { key: "partial", label: "Qisman", className: "bg-amber-50 text-amber-700" };
  }
  return { key: "unpaid", label: "To'lanmagan", className: "bg-rose-50 text-rose-700" };
};

// Tranzaksiyalardan to'langan summani hisoblaydi (payment − reversal) - §9.
export const paidFromTransactions = (transactions = []) =>
  transactions.reduce((sum, t) => {
    if (t.type === "payment") return sum + t.amount;
    if (t.type === "reversal") return sum - t.amount;
    return sum;
  }, 0);
