import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNav } from './components/sidebar-nav';
import { Header } from './components/header';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarNav, Header],
  template: `
    <div class="flex h-screen bg-slate-100">
      <app-sidebar-nav />

      <div class="flex flex-1 flex-col overflow-y-auto">
        <app-header />
        
        <main class="p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class Shell {}