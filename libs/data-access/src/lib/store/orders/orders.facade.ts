import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { CreateOrder, UpdateOrder } from '../../models/order.model';
import * as OrderActions from './orders.actions';
import * as OrderSelectors from './orders.selectors';

/**
 * Facade for managing orders state with NgRx.
 *
 * Provides a simplified API for components to interact with the orders store.
 * Exposes signals for reactive state and methods for dispatching actions.
 *
 * @usageNotes
 * ### Injecting the Facade
 * ```typescript
 * private readonly ordersFacade = inject(OrdersFacade);
 * ```
 *
 * ### Loading Orders
 * ```typescript
 * this.ordersFacade.loadOrders();
 * const orders = this.ordersFacade.orders();
 * ```
 *
 * @category Data Access
 * @see OrdersState
 */
@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  private readonly store = inject(Store);

  // === SELECTORS (données exposées aux components) ===

  /**
   * All orders from the store.
   * @readonly
   */
  orders = this.store.selectSignal(OrderSelectors.selectOrders);

  /**
   * Currently selected order.
   * @readonly
   */
  selectedOrder = this.store.selectSignal(OrderSelectors.selectSelectedOrder);

  /**
   * Loading state.
   * @readonly
   */
  loading = this.store.selectSignal(OrderSelectors.selectOrdersLoading);

  /**
   * Error message if an operation fails.
   * @readonly
   */
  error = this.store.selectSignal(OrderSelectors.selectOrdersError);

  // === ACTIONS (méthodes exposées aux components) ===

  /**
   * Loads all orders from the API.
   *
   * @example
   * ```typescript
   * this.ordersFacade.loadOrders();
   * ```
   */
  loadOrders(): void {
    this.store.dispatch(OrderActions.loadOrders());
  }

  /**
   * Deletes an order by ID.
   *
   * @param id - Order ID to delete
   *
   * @example
   * ```typescript
   * this.ordersFacade.deleteOrder('123');
   * ```
   */
  deleteOrder(id: string): void {
    this.store.dispatch(OrderActions.deleteOrder({ id }));
  }

  /**
   * Adds a new order.
   *
   * @param order - Order data to create (without id and calculated totals)
   * @param redirectTo - Optional route to redirect after success
   *
   * @example
   * ```typescript
   * this.ordersFacade.addOrder(newOrder, '/orders');
   * ```
   */
  addOrder(order: CreateOrder, redirectTo?: string): void {
    this.store.dispatch(OrderActions.addOrder({ order, redirectTo }));
  }

  /**
   * Updates an existing order.
   *
   * @param order - Order data to update (with id, without calculated totals)
   * @param redirectTo - Optional route to redirect after success
   *
   * @example
   * ```typescript
   * this.ordersFacade.updateOrder(updatedOrder, '/orders');
   * ```
   */
  updateOrder(order: UpdateOrder, redirectTo?: string): void {
    this.store.dispatch(OrderActions.updateOrder({ order, redirectTo }));
  }

  /**
   * Loads a specific order by ID.
   *
   * @param id - Order ID to load
   *
   * @example
   * ```typescript
   * this.ordersFacade.getOrderById('123');
   * ```
   */
  getOrderById(id: string): void {
    this.store.dispatch(OrderActions.getOrderById({ id }));
  }
}
