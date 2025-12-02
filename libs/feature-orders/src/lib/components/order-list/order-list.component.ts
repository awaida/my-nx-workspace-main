import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OrdersFacade } from '@mini-crm/data-access';
import { ConfirmModalComponent } from '@mini-crm/shared-ui';

// Bootstrap Modal type from @types/bootstrap
declare const bootstrap: {
  Modal: {
    getOrCreateInstance: (
      element: HTMLElement | string,
      options?: { backdrop?: boolean | string; keyboard?: boolean }
    ) => {
      show: () => void;
      hide: () => void;
      dispose: () => void;
    };
  };
};

/**
 * Order list component displaying all orders in a responsive Bootstrap table.
 *
 * Provides CRUD actions: view, edit, delete, and add new order.
 * Uses ConfirmModalComponent for delete confirmation.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-order-list />
 * ```
 *
 * ### In Routes
 * ```typescript
 * {
 *   path: 'orders',
 *   component: OrderListComponent
 * }
 * ```
 *
 * @see OrdersFacade
 * @see ConfirmModalComponent
 * @category Feature Orders
 */
@Component({
  selector: 'lib-order-list',
  imports: [RouterLink, ConfirmModalComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  private readonly ordersFacade = inject(OrdersFacade);
  private readonly router = inject(Router);

  /**
   * ID of the order to delete (set when delete button is clicked).
   */
  orderToDeleteId = signal<number | null>(null);

  /**
   * Modal ID constant for the delete confirmation modal.
   */
  private readonly MODAL_ID = 'deleteOrderModal';

  /**
   * Orders list from the NgRx store.
   * @readonly
   */
  orders = this.ordersFacade.orders;

  /**
   * Loading state from the NgRx store.
   * @readonly
   */
  loading = this.ordersFacade.loading;

  /**
   * Error message from the NgRx store.
   * @readonly
   */
  error = this.ordersFacade.error;

  ngOnInit(): void {
    // Load orders on component initialization
    this.ordersFacade.loadOrders();
  }

  /**
   * Handles the edit button click.
   * Navigates to the edit page for the specified order.
   *
   * @param orderId - ID of the order to edit
   */
  onEdit(orderId: number): void {
    this.router.navigate(['/orders', 'edit', orderId]);
  }

  /**
   * Handles the delete button click.
   * Opens the confirmation modal and stores the order ID.
   *
   * @param orderId - ID of the order to delete
   */
  onDeleteClick(orderId: number): void {
    this.orderToDeleteId.set(orderId);
    this.showModal();
  }

  /**
   * Handles the confirmation from the modal.
   * Dispatches delete action to NgRx store.
   */
  onConfirmDelete(): void {
    const orderId = this.orderToDeleteId();
    if (orderId === null) {
      return;
    }

    // Dispatch delete action to NgRx store
    this.ordersFacade.deleteOrder(String(orderId));
    this.orderToDeleteId.set(null);
  }

  /**
   * Opens the confirmation modal using Bootstrap API.
   */
  private showModal(): void {
    if (typeof bootstrap === 'undefined') {
      console.error('Bootstrap is not loaded');
      return;
    }

    const modalElement = document.getElementById(this.MODAL_ID);
    if (!modalElement) {
      console.error(`Modal element with ID "${this.MODAL_ID}" not found`);
      return;
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement, {
      backdrop: true,
      keyboard: true,
    });
    modal.show();
  }

  /**
   * Formats a number as currency in euros.
   *
   * @param amount - Amount to format
   * @returns Formatted currency string
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }
}

