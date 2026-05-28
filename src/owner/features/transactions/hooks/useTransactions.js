import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { transactionsAPI } from "../api/transactions.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.transactions.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const useTransactionsQuery = (params) =>
  useQuery({
    queryKey: qk.transactions.list(params),
    queryFn: () => transactionsAPI.list(params).then((r) => r.data),
  });

export const useTransactionsSummaryQuery = (params) =>
  useQuery({
    queryKey: qk.transactions.summary(params),
    queryFn: () => transactionsAPI.summary(params).then((r) => r.data.data),
  });

export const useCategoryReportQuery = (params) =>
  useQuery({
    queryKey: qk.reports.categoryMonthly(params),
    queryFn: () => transactionsAPI.categoryReport(params).then((r) => r.data.data),
  });

export const useTransactionCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => transactionsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Saqlandi");
    },
    onError,
  });
};

export const useTransactionUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => transactionsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Yangilandi");
    },
    onError,
  });
};

export const useTransactionDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => transactionsAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("O'chirildi");
    },
    onError,
  });
};
