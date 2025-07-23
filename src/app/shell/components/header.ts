import { Component, computed, inject, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { WebPage } from './../../shared/models/navigation.models';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="flex h-16 shrink-0 items-center justify-end border-b border-slate-700 bg-slate-800 px-6">
      <div class="relative">
        <!-- Avatar Button -->
        <button (click)="isDropdownOpen.set(!isDropdownOpen())" class="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 transition-transform duration-200 hover:scale-105 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800">
          @if(authService.currentUser()?.photoURL; as photoURL) {
            <img [src]="photoURL" alt="User avatar" class="h-full w-full rounded-full object-cover">
          } @else {
            <span class="text-sm font-semibold text-slate-200">{{ userInitials() }}</span>
          }
        </button>

        <!-- Dropdown Menu -->
        @if (isDropdownOpen()) {
          <div class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-slate-700 border border-slate-600 py-1 shadow-xl ring-1 ring-slate-600 focus:outline-none">
            <a 
              [routerLink]="settingsRoute" 
              (click)="isDropdownOpen.set(false)"
              class="block px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-600 hover:text-white">
              Settings
            </a>
            <button 
              (click)="logout()" 
              class="w-full text-left block px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-600 hover:text-white">
              Sign out
            </button>
          </div>
        }
      </div>
    </header>
  `,
})
export class Header {
  protected authService = inject(AuthService);
  private elementRef = inject(ElementRef);
  
  protected isDropdownOpen = signal(false);
  protected settingsRoute = WebPage.SETTINGS;

  // Close dropdown if user clicks outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

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

  protected logout(): void {
    this.isDropdownOpen.set(false);
    this.authService.logout();
  }
}