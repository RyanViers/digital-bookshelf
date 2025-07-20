import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAVIGATION_ITEMS, NavigationItem, WebPage } from '../../shared/models/navigation.models';
import { Icon} from './icon';

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <div class="flex h-full w-64 flex-col bg-slate-900 text-slate-300">
      <!-- App Logo/Title -->
      <div class="flex h-16 shrink-0 items-center gap-3 px-6">
        <app-icon name="books" class="h-8 w-8 text-indigo-500" />
        <span class="text-xl font-semibold text-white">Bookshelf</span>
      </div>

      <!-- Main Navigation (Top Section) -->
      <nav class="flex flex-1 flex-col gap-1 p-4">
        @for (item of mainNavItems(); track item.path) {
          <a 
            [routerLink]="item.path"
            routerLinkActive="border-indigo-500 bg-slate-800 text-white"
            [routerLinkActiveOptions]="{ exact: true }"
            class="group flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-2 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
          >
            <app-icon [name]="item.icon" />
            <span class="font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Settings/Profile Navigation (Bottom Section) -->
      <div class="border-t border-slate-700 p-4">
        <a 
          [routerLink]="settingsItem().path"
          routerLinkActive="bg-slate-800"
          class="group -mx-2 flex items-center gap-3 rounded-md p-2 transition-colors duration-200 hover:bg-slate-800"
        >
          <!-- Avatar -->
          <div class="h-9 w-9 flex-shrink-0 rounded-full bg-slate-700">
             <span class="text-sm font-semibold text-slate-400"></span>
          </div>
          <!-- Settings Label -->
          <div class="text-left">
            <p class="font-semibold text-white">{{ settingsItem().label }}</p>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class SidebarNav {
  private navItems = signal<NavigationItem[]>(NAVIGATION_ITEMS);

  protected mainNavItems = computed(() => this.navItems().filter(item => item.path !== WebPage.SETTINGS));
  protected settingsItem = computed(() => this.navItems().find(item => item.path === WebPage.SETTINGS)!);
}