export type Line = {
  id: number;
  description: string;
  quantity: number;
  price_per_qty: number;
  subtotal: number;
  invoice_id?: number;
  estimate_id?: number;
  created_at: string;
  updated_at: string;
};
