import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const E = ENDPOINTS.carAssignments;

export const carAssignmentsAPI = {
  list: (driverId) => http.get(E.base, { params: { driverId } }),
  create: (body) => http.post(E.base, body),
  update: (id, body) => http.patch(E.byId(id), body),
  remove: (id) => http.delete(E.byId(id)),
  changeCar: (body) => http.post(E.changeCar, body),
};
