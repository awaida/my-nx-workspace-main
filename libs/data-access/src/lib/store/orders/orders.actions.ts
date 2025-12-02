import { createAction, props } from '@ngrx/store';
import type { Order, CreateOrder, UpdateOrder } from '../../models/order.model';

// === ACTIONS LOAD ALL ORDERS ===
// dispatch component (ou facade)
// capturée par un reducer pour maj isLoading et isError dans le store
// capturée par un effect pour call api
export const loadOrders = createAction('[Orders] Load Orders');

// dispatch dans effect qui capte loadOrders si call api réussi
// capturée par un reducer pour maj la propriété orders
export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[] }>()
);

// dispatch dans effect qui capte loadOrders si call api échoue
// // capturée par un reducer pour maj la proporété isError du state
export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

// === ACTIONS DELETE ORDER ===
// dispatch component (ou facade)
// capturée par un reducer pour maj isLoading et isError dans le store
// capturée par un effect pour call api
export const deleteOrder = createAction(
  '[Orders] Delete Order',
  props<{ id: string }>()
);

// dispatch dans effect qui capte deleteOrder si call api réussi
// capturée par un reducer pour maj la propriété orders
export const deleteOrderSuccess = createAction(
  '[Orders] Delete Order Success',
  props<{ id: string }>()
);

// dispatch dans effect qui capte loadOrders si call api échoue
// capturée par un reducer pour maj la proporété isError du state
export const deleteOrderFailure = createAction(
  '[Orders] Delete Order Failure',
  props<{ error: string }>()
);

// === ACTIONS ADD ORDER ===
export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: CreateOrder; redirectTo?: string }>()
);

export const addOrderSuccess = createAction(
  '[Orders] Add Order Success',
  props<{ order: Order }>()
);

export const addOrderFailure = createAction(
  '[Orders] Add Order Failure',
  props<{ error: string }>()
);

// === ACTIONS UPDATE ORDER ===
export const updateOrder = createAction(
  '[Orders] Update Order',
  props<{ order: UpdateOrder; redirectTo?: string }>()
);

export const updateOrderSuccess = createAction(
  '[Orders] Update Order Success',
  props<{ order: Order }>()
);

export const updateOrderFailure = createAction(
  '[Orders] Update Order Failure',
  props<{ error: string }>()
);

// === ACTIONS SELECT ORDER ===
export const getOrderById = createAction(
  '[Orders] Get Order By id',
  props<{ id: string }>()
);

export const getOrderByIdSuccess = createAction(
  '[Orders] Order By id success',
  props<{ order: Order }>()
);

export const getOrderByIdFailure = createAction(
  '[Orders] Order By id failure',
  props<{ error: string }>()
);
