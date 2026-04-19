export type MenuItem = {
  name: string;
  price: number;
};

export type Restaurant = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  capacity: number;
  menuItems: MenuItem[];
  isActive: boolean;
};
