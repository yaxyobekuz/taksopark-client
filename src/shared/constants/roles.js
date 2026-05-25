// Static role values (also stored as-is in the DB)
export const ROLES = Object.freeze({
  OWNER: "owner",
});

export const ROLE_LABELS = Object.freeze({
  owner: "Ega",
});

export const ALL_ROLES = Object.values(ROLES);

// Default landing route per role
export const ROLE_HOME = Object.freeze({
  owner: "/owner",
});
