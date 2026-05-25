const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export const buildFileUrl = (relPath) => {
  if (!relPath) return "";
  if (/^https?:\/\//.test(relPath)) return relPath;
  if (relPath.startsWith("/")) return `${SERVER_ORIGIN}${relPath}`;
  return `${SERVER_ORIGIN}/${relPath}`;
};
