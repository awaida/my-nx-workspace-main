import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { OrdersStore, type OrdersStoreType } from '@mini-crm/data-access';
import { OrderFormComponent } from '../order-form/order-form.component';
import type { UpdateOrder, CreateOrder } from '@mini-crm/data-access';

/**
 * Component for adding a new order.
 *
 * Uses OrderFormComponent in create mode (order = null).
 * Handles order creation and navigation back to the orders list.
 *
 * @usageNotes
 * ### In Routes
 * ```typescript
 * {
 *   path: 'orders/add',
 *   component: OrderAddComponent
 * }
 * ```
 *
 * @see OrderFormComponent
 * @see OrdersStore
 * @see OrderEditComponent
 * @category Feature Orders
 */
@Component({
  selector: 'lib-order-add',
  imports: [OrderFormComponent],
  templateUrl: './order-add.component.html',
  styleUrl: './order-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAddComponent {
  private readonly store: OrdersStoreType = inject(OrdersStore);

  /**
   * Handles the save event from OrderFormComponent.
   * Dispatches add action to SignalStore with redirect to orders list.
   *
   * @param orderData - Order data from form (UpdateOrder with id = 0)
   */
  onSave(orderData: UpdateOrder): void {
    // Convert UpdateOrder to CreateOrder by removing id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...createOrder } = orderData;

    // Add order via SignalStore with redirect
    this.store.addOrder({
      order: createOrder as CreateOrder,
      redirectTo: '/orders',
    });
  }

  /**
   * Handles the cancel event from OrderFormComponent.
   * Navigates back to the orders list without saving.
   */
  onCancel(): void {
    window.history.back();
  }
}
