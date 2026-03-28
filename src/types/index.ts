export type Arepa = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  segment?: string;
};

export type Order = {
  id: number;
  items: Arepa[];
  total: number;
  createdAt: number;
  name?: string;
  paymentMethod?: string; // 'Efectivo' o 'Transferencia'
};

export type SaleRecord = {
  id: string;
  fecha: string;
  cliente: string;
  resumen: string;
  total: number;
  metodoPago: string;
};
