import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@mini-crm/data-access';

/**
 * Header component for the application.
 *
 * Displays the application logo (briefcase icon) and title "Mini CRM".
 * Visible after user authentication. Features dark background with white text.
 *
 * @usageNotes
 * ### Basic Usage
 * ```html
 * <lib-header />
 * ```
 *
 * ### With Layout Component
 * ```html
 * <lib-layout>
 *   <lib-header layout-header />
 *   <!-- other content -->
 * </lib-layout>
 * ```
 *
 * @see LayoutComponent
 * @see SidebarComponent
 * @category Layout
 */
@Component({
  selector: 'lib-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
  logout(): void {
    this.authService.logout();
  }
}
