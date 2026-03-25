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
};
