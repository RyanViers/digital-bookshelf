import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="mx-auto max-w-4xl">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-slate-800">Settings</h1>
        <p class="mt-1 text-slate-500">Manage your profile and application preferences.</p>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="p-8 space-y-8">
          <div>
            <h2 class="text-lg font-semibold leading-7 text-slate-900">Profile</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">This information will be displayed publicly.</p>
            <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-4">
                <label for="username" class="block text-sm font-medium leading-6 text-slate-900">Username</label>
                <div class="mt-2">
                  <input type="text" id="username" value="Bookworm_123" class="block w-full rounded-md border-0 p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300">
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  `,
})
export class Settings {}