import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import type { Order, CreateOrder, UpdateOrder } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';

// === STATE TYPE ===
type OrdersState = {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
};

// === INITIAL STATE ===
const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

/**
 * Orders SignalStore - Manages orders state with NgRx SignalStore.
 *
 * Provides reactive state management using Angular signals.
 * Handles CRUD operations for orders with loading/error states.
 *
 * @usageNotes
 * ### Injecting the Store
 * ```typescript
 * readonly store = inject(OrdersStore);
 * ```
 *
 * ### Loading Orders
 * ```typescript
 * this.store.loadOrders();
 * const orders = this.store.orders();
 * ```
 *
 * ### Creating an Order
 * ```typescript
 * this.store.addOrder({ order: newOrder, redirectTo: '/orders' });
 * ```
 *
 * @see Order
 * @see CreateOrder
 * @see UpdateOrder
 * @category Data Access
 */
export const OrdersStore = signalStore(
  { providedIn: 'root' },

  // State
  withState(initialState),

  // Computed signals
  withComputed(({ orders, loading, error }) => ({
    /**
     * Total number of orders
     * @computed
     */
    ordersCount: computed(() => orders().length),

    /**
     * Total revenue (TTC)
     * @computed
     */
    totalRevenue: computed(() =>
      orders().reduce((sum, order) => sum + order.totalTtc, 0)
    ),

    /**
     * Total revenue (HT)
     * @computed
     */
    totalRevenueHt: computed(() =>
      orders().reduce((sum, order) => sum + order.totalHt, 0)
    ),

    /**
     * Whether there is an error
     * @computed
     */
    hasError: computed(() => error() !== null),

    /**
     * Whether the orders list is empty (and not loading)
     * @computed
     */
    isEmpty: computed(() => !loading() && orders().length === 0),
  })),

  // Methods (actions + effects combined)
  withMethods(
    (
      store,
      ordersService = inject(OrdersService),
      router = inject(Router)
    ) => ({
      /**
       * Loads all orders from the API.
       *
       * @example
       * ```typescript
       * this.store.loadOrders();
       * ```
       */
      loadOrders: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            ordersService.getAll().pipe(
              tapResponse({
                next: (orders) => patchState(store, { orders, loading: false }),
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error.message,
                  }),
              })
            )
          )
        )
      ),

      /**
       * Adds a new order.
       *
       * @param params - Object containing order data and optional redirect path
       *
       * @example
       * ```typescript
       * this.store.addOrder({ order: newOrder, redirectTo: '/orders' });
       * ```
       */
      addOrder: rxMethod<{ order: CreateOrder; redirectTo?: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(({ order, redirectTo }) =>
            ordersService.create(order).pipe(
              tapResponse({
                next: (createdOrder) => {
                  patchState(store, {
                    orders: [...store.orders(), createdOrder],
                    loading: false,
                  });
                  if (redirectTo) {
                    router.navigate([redirectTo]);
                  }
                },
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error.message,
                  }),
              })
            )
          )
        )
      ),

      /**
       * Updates an existing order.
       *
       * @param params - Object containing order data and optional redirect path
       *
       * @example
       * ```typescript
       * this.store.updateOrder({ order: updatedOrder, redirectTo: '/orders' });
       * ```
       */
      updateOrder: rxMethod<{ order: UpdateOrder; redirectTo?: string }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(({ order, redirectTo }) =>
            ordersService.update(order).pipe(
              tapResponse({
                next: (updatedOrder) => {
                  patchState(store, {
                    orders: store
                      .orders()
                      .map((o) =>
                        o.id === updatedOrder.id ? updatedOrder : o
                      ),
                    selectedOrder:
                      store.selectedOrder()?.id === updatedOrder.id
                        ? updatedOrder
                        : store.selectedOrder(),
                    loading: false,
                  });
                  if (redirectTo) {
                    router.navigate([redirectTo]);
                  }
                },
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error.message,
                  }),
              })
            )
          )
        )
      ),

      /**
       * Deletes an order by ID.
       *
       * @param id - Order ID to delete (as string)
       *
       * @example
       * ```typescript
       * this.store.deleteOrder('123');
       * ```
       */
      deleteOrder: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((id) =>
            ordersService.delete(Number(id)).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    orders: store.orders().filter((o) => o.id !== Number(id)),
                    selectedOrder:
                      store.selectedOrder()?.id === Number(id)
                        ? null
                        : store.selectedOrder(),
                    loading: false,
                  });
                },
                error: (error: Error) =>
                  patchState(store, {
                    loading: false,
                    error: error.message,
                  }),
              })
            )
          )
        )
      ),

      /**
       * Loads a specific order by ID.
       *
       * @param id - Order ID to load (as string)
       *
       * @example
       * ```typescript
       * this.store.getOrderById('123');
       * ```
       */
      getOrderById: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((id) =>
            ordersService.getById(Number(id)).pipe(
              tapResponse({
                next: (order) =>
                  patchState(store, { selectedOrder: order, loading: false }),
                error: (error: Error) =>
                  patchState(store, {
                    selectedOrder: null,
                    loading: false,
                    error: error.message,
                  }),
              })
            )
          )
        )
      ),

      // === SYNC METHODS (without API calls) ===

      /**
       * Clears the current error.
       */
      clearError(): void {
        patchState(store, { error: null });
      },

      /**
       * Clears the currently selected order.
       */
      clearSelectedOrder(): void {
        patchState(store, { selectedOrder: null });
      },

      /**
       * Finds an order by ID from the local state.
       *
       * @param id - Order ID to find
       * @returns The order if found, undefined otherwise
       */
      findOrderById(id: number): Order | undefined {
        return store.orders().find((o) => o.id === id);
      },
    })
  )
);

// Type export for injection typing
export type OrdersStoreType = InstanceType<typeof OrdersStore>;
