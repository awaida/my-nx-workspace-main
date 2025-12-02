import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { OrdersState } from './orders.state';

/**
 * Feature selector for orders state
 */
export const selectOrdersState = createFeatureSelector<OrdersState>('orders');

/**
 * Selects all orders from the state
 */
export const selectOrders = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.orders
);

/**
 * Selects the currently selected order
 */
export const selectSelectedOrder = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.selectedOrder
);

/**
 * Selects the loading state
 */
export const selectOrdersLoading = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.loading
);

/**
 * Selects the error state
 */
export const selectOrdersError = createSelector(
  selectOrdersState,
  (state: OrdersState) => state.error
);
