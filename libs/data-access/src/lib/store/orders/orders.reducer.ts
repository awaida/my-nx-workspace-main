import { createReducer, on } from '@ngrx/store';
import { initialOrdersState } from './orders.state';
import * as OrderActions from './orders.actions';

export const ordersReducer = createReducer(
  initialOrdersState,

  // === LOAD ORDERS ===
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders: orders,
    loading: false,
    error: null,
  })),

  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === DELETE ORDER ===
  on(OrderActions.deleteOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
    ...state,
    orders: state.orders.filter((order) => order.id !== Number(id)),
    // Reset selectedOrder si c'est celle qui a été supprimée
    selectedOrder:
      state.selectedOrder?.id === Number(id) ? null : state.selectedOrder,
    loading: false,
    error: null,
  })),

  on(OrderActions.deleteOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === ADD ORDER ===
  on(OrderActions.addOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.addOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order],
    loading: false,
    error: null,
  })),

  on(OrderActions.addOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === UPDATE ORDER ===
  on(OrderActions.updateOrder, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.updateOrderSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map((existingOrder) =>
      existingOrder.id === order.id ? order : existingOrder
    ),
    // Mettre à jour selectedOrder si c'est celle qui a été modifiée
    selectedOrder:
      state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    loading: false,
    error: null,
  })),

  on(OrderActions.updateOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // === GET ORDER BY ID ===
  on(OrderActions.getOrderById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(OrderActions.getOrderByIdSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false,
    error: null,
  })),

  on(OrderActions.getOrderByIdFailure, (state, { error }) => ({
    ...state,
    selectedOrder: null,
    loading: false,
    error,
  }))
);
