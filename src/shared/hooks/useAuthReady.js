// App start'dagi bir martalik auth bootstrap holatini va token mavjudligini kuzatish.
// localStorage o'rniga ishlatiladi - access token endi faqat xotirada.
import { useSyncExternalStore } from "react";
import { bootstrapAuth, getAccessToken, onTokenChange } from "@/shared/api/http";

let ready = false;
let bootPromise = null;
const listeners = new Set();

const emit = () => listeners.forEach((cb) => cb());

// token o'zgarganda (login/logout/refresh) ham qayta render bo'lsin
onTokenChange(emit);

// main.jsx'da app render'idan oldin chaqiriladi
export const initAuth = () => {
  if (bootPromise) return bootPromise;
  bootPromise = bootstrapAuth().finally(() => {
    ready = true;
    emit();
  });
  return bootPromise;
};

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

// ready va token holatini bitta snapshot sifatida cache qilamiz (getSnapshot barqaror bo'lishi shart)
let snapshot = { ready: false, hasToken: false };
const getSnapshot = () => {
  const hasToken = !!getAccessToken();
  if (snapshot.ready !== ready || snapshot.hasToken !== hasToken) {
    snapshot = { ready, hasToken };
  }
  return snapshot;
};

// { ready, hasToken } - ready: bootstrap tugadimi, hasToken: sessiya mavjudmi
const useAuthReady = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => snapshot);

export default useAuthReady;
