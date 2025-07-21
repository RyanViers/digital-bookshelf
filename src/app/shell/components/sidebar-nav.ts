import { Component, computed, inject, signal, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_ITEMS, NavigationItem, WebPage } from './../../shared/models/navigation.models';
import { Icon } from './icon';
import { AuthService } from './../../shared/services/auth.service';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <div 
      class="fixed top-0 left-0 h-full flex flex-col bg-gray-900 text-slate-400 transition-[width] duration-300 ease-in-out z-20"
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()">
      
      <!-- App Logo/Title -->
      <div class="flex h-16 shrink-0 items-center gap-3 px-6">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 flex-shrink-0">
          <app-icon name="books" class="h-6 w-6 text-cyan-400" />
        </div>
        <span class="text-xl font-bold text-white transition-opacity duration-200 whitespace-nowrap" [class.opacity-0]="isCollapsed()">Bookshelf</span>
      </div>

      <!-- Main Navigation -->
      <nav class="flex flex-1 flex-col gap-1 p-4">
        @for (item of mainNavItems(); track item.path) {
          <a 
            [routerLink]="item.path"
            routerLinkActive="bg-gray-800 border-cyan-400 text-white"
            [routerLinkActiveOptions]="{ exact: true }"
            class="group flex items-center gap-4 rounded-md border-l-4 border-transparent px-3 py-3 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
            [title]="isCollapsed() ? item.label : ''">
            <app-icon [name]="item.icon" class="h-6 w-6 flex-shrink-0" />
            <span class="font-medium transition-opacity duration-200 whitespace-nowrap" [class.opacity-0]="isCollapsed()">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer Section -->
      <div class="mt-auto border-t border-white/10 p-2">
        <div 
          class="flex items-center"
          [class.flex-col-reverse]="isCollapsed()"
          [class.gap-2]="isCollapsed()"
          [class.flex-row]="!isCollapsed()"
          [class.gap-1]="!isCollapsed()">
          
          <!-- Settings Link -->
          <a 
            [routerLink]="settingsItem().path"
            routerLinkActive="bg-gray-800/50"
            class="group flex flex-grow items-center gap-3 rounded-md p-2 transition-colors duration-200 hover:bg-gray-800"
            [title]="isCollapsed() ? settingsItem().label : ''">
            @if(authService.currentUser()?.photoURL; as photoURL) {
              <img [src]="photoURL" alt="User avatar" class="h-9 w-9 flex-shrink-0 rounded-full object-cover bg-gray-700">
            } @else {
              <div class="h-9 w-9 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                <span class="text-sm font-semibold text-slate-400">{{ userInitials() }}</span>
              </div>
            }
            <span class="font-semibold text-white transition-opacity duration-200 whitespace-nowrap" [class.opacity-0]="isCollapsed()" [class.hidden]="isCollapsed()">
              {{ settingsItem().label }}
            </span>
          </a>
          
          <!-- Collapse Button -->
          <button (click)="toggleCollapse.emit()" class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-gray-800 hover:text-white" [title]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
            @if(!isCollapsed()) {
              <svg class="h-6 w-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" /></svg>
            } @else {
              <svg class="h-6 w-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" /></svg>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SidebarNav {
  public isCollapsed = input.required<boolean>();
  public toggleCollapse = output<void>();

  protected authService = inject(AuthService);
  private navItems = signal<NavigationItem[]>(NAVIGATION_ITEMS);

  protected mainNavItems = computed(() => this.navItems().filter(item => item.path !== WebPage.SETTINGS));
  protected settingsItem = computed(() => this.navItems().find(item => item.path === WebPage.SETTINGS)!);

  protected userInitials = computed(() => {
    const email = this.authService.currentUser()?.email;
    if (!email) return '';
    const namePart = email.split('@')[0];
    const parts = namePart.split('.').filter(p => p.length > 0);
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    } else if (namePart.length > 0) {
      return namePart[0].toUpperCase();
    }
    return '';
  });
}