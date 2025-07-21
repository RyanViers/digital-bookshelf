import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNav } from './components/sidebar-nav';
import { Header } from './components/header';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarNav, Header],
  template: `
    <div class="flex h-screen bg-slate-100">
      <!-- The sidebar now receives the collapsed state and emits an event to toggle it -->
      <app-sidebar-nav 
        [isCollapsed]="isSidebarCollapsed()" 
        (toggleCollapse)="isSidebarCollapsed.set(!isSidebarCollapsed())" 
      />

      <!-- The main content area now has a dynamic margin that reacts to the collapsed state -->
      <div 
        class="flex flex-1 flex-col overflow-y-auto transition-[margin-left] duration-300 ease-in-out"
        [class.ml-64]="!isSidebarCollapsed()"
        [class.ml-20]="isSidebarCollapsed()">
        <app-header />
        
        <main class="p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Shell {
  isSidebarCollapsed = signal(false);
}