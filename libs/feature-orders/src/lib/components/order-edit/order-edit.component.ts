import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersFacade } from '@mini-crm/data-access';
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
 * @see OrdersFacade
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
  private readonly ordersFacade = inject(OrdersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /**
   * Order to edit, from NgRx store.
   * @readonly
   */
  order = this.ordersFacade.selectedOrder;

  /**
   * Loading state from NgRx store.
   * @readonly
   */
  loading = this.ordersFacade.loading;

  /**
   * Error message from NgRx store.
   * @readonly
   */
  error = this.ordersFacade.error;

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

    // Dispatch action to load order by ID
    this.ordersFacade.getOrderById(String(orderId));
  }

  /**
   * Handles the save event from OrderFormComponent.
   * Dispatches update action to NgRx store with redirect to orders list.
   *
   * @param orderData - Order data to update
   */
  onSave(orderData: UpdateOrder): void {
    // Dispatch update action with redirect
    this.ordersFacade.updateOrder(orderData, '/orders');
  }

  /**
   * Handles the cancel event from OrderFormComponent.
   * Navigates back to the orders list without saving.
   */
  onCancel(): void {
    this.router.navigate(['/orders']);
  }
}

