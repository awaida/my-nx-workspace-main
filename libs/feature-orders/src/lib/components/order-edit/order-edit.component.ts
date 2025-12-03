import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersStore, type OrdersStoreType } from '@mini-crm/data-access';
import { OrderFormComponent } from '../order-form/order-form.component';
import type { UpdateOrder } from '@mini-crm/data-access';

/**
 * Component for editing an existing order.
 *
 * Retrieves the order ID from route parameters and loads the order data.
 * Uses OrderFormComponent in edit mode with the loaded order.
 * Handles order update and navigation back to the orders list.
 *
 * @usageNotes
 * ### In Routes
 * ```typescript
 * {
 *   path: 'orders/edit/:id',
 *   component: OrderEditComponent
 * }
 * ```
 *
 * ### Error Handling
 * If the order ID is invalid or the order doesn't exist,
 * the component automatically redirects to the orders list.
 *
 * @see OrderFormComponent
 * @see OrdersStore
 * @see OrderAddComponent
 * @category Feature Orders
 */
@Component({
  selector: 'lib-order-edit',
  imports: [OrderFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEditComponent implements OnInit {
  private readonly store: OrdersStoreType = inject(OrdersStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Order to edit, from SignalStore.
   * @readonly
   */
  order = this.store.selectedOrder;

  /**
   * Loading state from SignalStore.
   * @readonly
   */
  loading = this.store.loading;

  /**
   * Error message from SignalStore.
   * @readonly
   */
  error = this.store.error;

  constructor() {
    // Redirect to orders list if order becomes null (not found) and we have an error
    effect(() => {
      const orderValue = this.order();
      const errorValue = this.error();
      
      // If order is null and we have an error, redirect to list
      if (orderValue === null && errorValue && !this.loading()) {
        console.error('Order not found, redirecting to orders list');
        this.router.navigate(['/orders']);
      }
    });
  }

  ngOnInit(): void {
    // Get order ID from route parameters
    const orderIdParam = this.route.snapshot.paramMap.get('id');
    
    if (!orderIdParam) {
      console.error('Order ID is missing from route parameters');
      this.router.navigate(['/orders']);
      return;
    }

    const orderId = Number.parseInt(orderIdParam, 10);
    
    if (Number.isNaN(orderId)) {
      console.error(`Invalid order ID: ${orderIdParam}`);
      this.router.navigate(['/orders']);
      return;
    }

    // Load order by ID via SignalStore
    this.store.getOrderById(String(orderId));
  }

  /**
   * Handles the save event from OrderFormComponent.
   * Dispatches update action to SignalStore with redirect to orders list.
   *
   * @param orderData - Order data to update
   */
  onSave(orderData: UpdateOrder): void {
    // Update via SignalStore with redirect
    this.store.updateOrder({ order: orderData, redirectTo: '/orders' });
  }

  /**
   * Handles the cancel event from OrderFormComponent.
   * Navigates back to the orders list without saving.
   */
  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}
