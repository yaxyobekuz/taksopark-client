import { useOutletContext, useParams } from "react-router-dom";
import { CalendarOff, CalendarCheck } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import usePermissions from "@/shared/hooks/usePermissions";

import SelectField from "@/shared/components/ui/select/SelectField";
import ProgressBar from "@/shared/components/ui/progress/ProgressBar";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import { PERMISSIONS } from "@/shared/constants/permissions";
import { months as MONTHS } from "@/shared/utils/date.utils";
import { formatMoney } from "@/shared/utils/formatMoney";

const WEEKDAYS_UZ = [
  "yakshanba",
  "dushanba",
  "seshanba",
  "chorshanba",
  "payshanba",
  "juma",
  "shanba",
];

import {
  useRestdayCalendarQuery,
} from "@/owner/features/restdays/hooks/useRestdaysQuery";
import {
  useRestdayCreate,
  useRestdayDelete,
} from "@/owner/features/restdays/hooks/useRestdayMutations";

const startYear = (driver) =>
  driver?.startDate ? new Date(driver.startDate).getFullYear() : new Date().getFullYear();

const DriverWorkDaysPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  const { has } = usePermissions();

  const now = new Date();
  const { year, month, setField } = useObjectState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { data, isLoading } = useRestdayCalendarQuery({ driverId: id, year, month });
  const days = data?.days || [];

  const restdayCreate = useRestdayCreate();
  const restdayDelete = useRestdayDelete();
  const canManage = has(PERMISSIONS.REST_DAYS_MANAGE);

  const yearOptions = [];
  for (let y = startYear(driver); y <= now.getFullYear(); y += 1) {
    yearOptions.push({ value: String(y), label: String(y) });
  }
  const monthOptions = MONTHS.map((m) => ({ value: String(m.value + 1), label: m.label }));

  // Tashkent (UTC+5) bugungi kun "YYYY-MM-DD" - brauzer TZ'siga bog'liq emas.
  const todayKey = new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-32">
          <SelectField
            label="Yil"
            value={String(year)}
            onChange={(v) => setField("year", Number(v))}
            options={yearOptions}
          />
        </div>
        <div className="w-40">
          <SelectField
            label="Oy"
            value={String(month)}
            onChange={(v) => setField("month", Number(v))}
            options={monthOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <SkeletonCard count={3} />
      ) : days.length === 0 ? (
        <EmptyState title="Ma'lumot yo'q" description="Bu oy uchun ish kunlari mavjud emas" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {days.map((d) => {
            // dateKey "YYYY-MM-DD" - Tashkent kuni. UTC sifatida o'qiymiz (TZ siljishsiz).
            const dayUTC = new Date(`${d.dateKey}T00:00:00Z`);
            const dayNum = dayUTC.getUTCDate();
            const isPastOrToday = d.dateKey <= todayKey;

            const plan = d.payment?.expectedPlan || d.dailyPlan || 0;
            const paid = d.payment?.amount || 0;
            const progress = plan > 0 ? (paid / plan) * 100 : 0;

            return (
              <div
                key={d.dateKey}
                className={`rounded-lg border p-3 flex flex-col gap-2 ${
                  d.isRestDay ? "bg-amber-50 border-amber-200" : "bg-white"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-semibold">{dayNum}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {WEEKDAYS_UZ[dayUTC.getUTCDay()]}
                  </span>
                </div>

                {d.isRestDay ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                      <CalendarOff size={14} /> Dam olish kuni
                    </span>
                    {canManage && (
                      <button
                        type="button"
                        disabled={restdayDelete.isPending}
                        onClick={() => restdayDelete.mutate(d.restDayId)}
                        className="mt-auto text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <CalendarCheck size={14} /> Ish kuniga aylantirish
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <ProgressBar value={progress} />
                      <p className="text-xs text-muted-foreground">
                        {formatMoney(paid)} / {formatMoney(plan)}
                      </p>
                    </div>
                    {canManage && paid === 0 && isPastOrToday && (
                      <button
                        type="button"
                        disabled={restdayCreate.isPending}
                        onClick={() =>
                          restdayCreate.mutate({
                            driverId: id,
                            date: d.dateKey,
                          })
                        }
                        className="mt-auto text-xs text-muted-foreground hover:text-amber-700 inline-flex items-center gap-1"
                      >
                        <CalendarOff size={14} /> Dam olish deb belgilash
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DriverWorkDaysPage;
