
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
  color: string;
}
