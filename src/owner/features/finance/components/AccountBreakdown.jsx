import { formatMoney } from "@/shared/utils/formatMoney";

// Haydovchi qarzi/balansi NIMADAN tashkil topganini ko'rsatadi (§10 hisob).
const Line = ({ label, value, sign }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="tabular-nums">
      {sign}
      {formatMoney(value)}
    </span>
  </div>
);

const AccountBreakdown = ({ account }) => {
  if (!account) return null;

  const debits = [
    ["Kunlik reja (jami)", account.daily],
    ["Jarima", account.fines],
    ["Zarar", account.damages],
    ["Depozit chiqim", account.depositOut],
    ["Berilgan keshbek", account.cashbackPayout],
  ].filter(([, v]) => v > 0);

  const credits = [
    ["To'langan", account.payments],
    ["Depozit kirim", account.depositIn],
    ["Hisoblangan keshbek", account.cashbackAccrued],
  ].filter(([, v]) => v > 0);

  const isDebt = account.debt > 0;

  return (
    <div className="rounded-lg border divide-y">
      <div className="px-3 py-2">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">Majburiyatlar</p>
        {debits.length ? (
          debits.map(([label, value]) => <Line key={label} label={label} value={value} sign="−" />)
        ) : (
          <p className="py-1 text-sm text-muted-foreground">—</p>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">Qoplagan</p>
        {credits.length ? (
          credits.map(([label, value]) => <Line key={label} label={label} value={value} sign="+" />)
        ) : (
          <p className="py-1 text-sm text-muted-foreground">—</p>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2 font-semibold">
        <span>{isDebt ? "Qarz" : "Balans"}</span>
        <span className="tabular-nums">{formatMoney(isDebt ? account.debt : account.available)}</span>
      </div>
    </div>
  );
};

export default AccountBreakdown;
