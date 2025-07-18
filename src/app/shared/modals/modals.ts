import { Component, computed, inject } from '@angular/core';
import { ModalService } from './modals.service';

@Component({
  selector: 'app-modal',
  template: `
    @if (modalService.config(); as config) {
      <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10" [class]="iconContainerClass()">
                  <!-- Dynamic Icon -->
                  @switch (config.type) {
                    @case ('warning') {
                      <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    }
                    @case ('error') {
                      <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
                    }
                    @case ('success') {
                      <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    }
                  }
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{{ config.title }}</h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">{{ config.message }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button (click)="modalService.confirm()" type="button" class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto" [class]="confirmButtonClass()">
                {{ config.confirmText || 'Confirm' }}
              </button>
              <button (click)="modalService.cancel()" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                {{ config.cancelText || 'Cancel' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  protected modalService = inject(ModalService);

  protected iconContainerClass = computed(() => {
    const type = this.modalService.config()?.type;
    switch (type) {
      case 'warning': return 'bg-red-100';
      case 'error': return 'bg-red-100';
      case 'success': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  });

  protected confirmButtonClass = computed(() => {
    const type = this.modalService.config()?.type;
    switch (type) {
      case 'warning': return 'bg-red-600 hover:bg-red-500';
      case 'error': return 'bg-red-600 hover:bg-red-500';
      case 'success': return 'bg-indigo-600 hover:bg-indigo-500';
      default: return 'bg-gray-600 hover:bg-gray-500';
    }
  });
}