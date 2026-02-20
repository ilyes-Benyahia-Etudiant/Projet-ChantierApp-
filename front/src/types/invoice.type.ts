
import type { Estimate } from "./estimate.type"

export type InvoiceStatus = "to_be_payed" | "payed" | "pending" | "cancelled"

export type Invoice = {
  id: number
  object: string
  payment_type: string
  status: InvoiceStatus 
  estimate_id: number
  created_at: string
  updated_at: string
  estimate?: Estimate
}