import { Order } from '../../models/order.model';

/**
 * Orders state interface
 */
export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

/**
 * Initial state
 */
export const initialOrdersState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};
