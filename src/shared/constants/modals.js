// Modal keys - also used as the Redux store name; never hardcode the string elsewhere
export const MODAL = Object.freeze({
  GLOBAL_SEARCH: "global:search",

  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",
  ACTIVITY_LOG_DETAIL: "activityLog:detail",

  ADMIN_CREATE: "admin:create",
  ADMIN_EDIT: "admin:edit",
  ADMIN_DELETE: "admin:delete",
  ADMIN_PASSWORD: "admin:password",
  MY_PASSWORD: "me:password",

  CAR_CREATE: "car:create",
  CAR_EDIT: "car:edit",
  CAR_DELETE: "car:delete",

  CAR_PRICE_FORM: "carPrice:form",
  CAR_PRICE_DELETE: "carPrice:delete",

  CAR_DOC_TYPE_CREATE: "carDocType:create",
  CAR_DOC_TYPE_EDIT: "carDocType:edit",
  CAR_DOC_TYPE_DELETE: "carDocType:delete",

  CAR_DOC_CREATE: "carDoc:create",
  CAR_DOC_EDIT: "carDoc:edit",
  CAR_DOC_DELETE: "carDoc:delete",

  DRIVER_DOC_TYPE_CREATE: "driverDocType:create",
  DRIVER_DOC_TYPE_EDIT: "driverDocType:edit",
  DRIVER_DOC_TYPE_DELETE: "driverDocType:delete",

  DRIVER_DOC_CREATE: "driverDoc:create",
  DRIVER_DOC_EDIT: "driverDoc:edit",
  DRIVER_DOC_DELETE: "driverDoc:delete",

  DRIVER_CREATE: "driver:create",
  DRIVER_EDIT: "driver:edit",
  DRIVER_CHANGE_CAR: "driver:changeCar",

  WORK_PERIOD_FORM: "workPeriod:form",
  WORK_PERIOD_DELETE: "workPeriod:delete",

  CAR_ASSIGNMENT_FORM: "carAssignment:form",
  CAR_ASSIGNMENT_DELETE: "carAssignment:delete",

  PAYMENT_DAY: "payment:day",
  PAYMENT_ADD: "payment:add",
  PAYMENT_QUICK: "payment:quick",
  CASHBACK_DRIVER: "cashback:driver",
  DEPOSIT_DRIVER: "deposit:driver",

  REST_DAY_CREATE: "restDay:create",
  REST_DAY_DELETE: "restDay:delete",

  FINE_CREATE: "fine:create",
  FINE_DELETE: "fine:delete",

  DAMAGE_CREATE: "damage:create",
  DAMAGE_DELETE: "damage:delete",
});
