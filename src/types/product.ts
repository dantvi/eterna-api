export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Stored as DECIMAL(10,2), shown as integer in frontend
  image_url: string;
  stock: number;
}
