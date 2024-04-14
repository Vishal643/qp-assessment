export interface BookGrocery {
  groceryId: string;
  quantity: number;
}

export interface UnavailableGrocery {
  groceryId: string;
  availableQuantity: number;
  requestedQuantity: number;
  name: string;
}

export interface AvailableGrocery {
  groceryId: string;
  requestedQuantity: number;
  name: string;
  availableQuantity: number;
  quantity: number;
}
