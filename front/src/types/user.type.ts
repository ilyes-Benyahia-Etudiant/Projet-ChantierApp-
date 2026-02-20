/**
 * Types pour les utilisateurs et leurs profils
 */
export type Role = "customer" | "entreprise" | "admin";

/**
 * Address type definition
 */
export type Address = {
  id?: number;
  address_line_1: string;
  zip_code: string;
  city: string;
  country: string;
}

/**
 * Customer profile type definition
 */
export type CustomerProfile = {
  id: number
  firstName: string
  name: string
  telephone: string
  address: Address
}

/**
 * Entreprise profile type definition
 */
export type EntrepriseProfile = {
  id: number
  raisonSociale: string
  siret: string
  firstName: string
  name: string
  telephone: string
  address: Address
  professions: string[]
}

/**
 * User type definition
 */
export type User =
  | { id: number; role: "customer"; email: string; profile: CustomerProfile }
  | { id: number; role: "entreprise"; email: string; profile: EntrepriseProfile }
  | { id: number; role: "admin"; email: string }

