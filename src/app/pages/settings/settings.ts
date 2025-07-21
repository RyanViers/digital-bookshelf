import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ModalService } from '../../shared/modals/modals.service';
import { FirestoreService } from '../../shared/services/firestore.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Settings</h1>
        <p class="mt-1 text-slate-500">Manage your account and application preferences.</p>
      </div>

      <!-- Profile Card -->
      <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="p-6">
          <h2 class="text-lg font-semibold leading-7 text-slate-900">Profile</h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">This information will be displayed publicly.</p>
        </div>
        <div class="border-t border-slate-200">
          <dl class="divide-y divide-slate-100">
            <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-slate-900">Email address</dt>
              <dd class="mt-1 text-sm text-slate-700 sm:col-span-2 sm:mt-0">{{ authService.currentUser()?.email }}</dd>
            </div>
            <div class="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-slate-900">Profile Photo</dt>
              <dd class="mt-2 text-sm text-slate-700 sm:col-span-2 sm:mt-0">
                <div class="flex items-center gap-x-4">
                  <!-- Display the uploaded image or a placeholder with initials -->
                  @if(authService.currentUser()?.photoURL; as photoURL) {
                    <img [src]="photoURL" alt="User avatar" class="h-16 w-16 rounded-full object-cover bg-slate-200">
                  } @else {
                    <div class="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <span class="text-2xl font-semibold text-slate-500">{{ userInitials() }}</span>
                    </div>
                  }
                  <label for="file-upload" class="relative cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                    <span>{{ isUploading() ? 'Uploading...' : 'Change photo' }}</span>
                    <input id="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)" [disabled]="isUploading()">
                  </label>
                  @if(authService.currentUser()?.photoURL) {
                    <button (click)="promptDeletePhoto()" class="text-sm font-semibold text-red-600 hover:text-red-500">Remove</button>
                  }
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Security Card -->
      <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="p-6">
          <h2 class="text-lg font-semibold leading-7 text-slate-900">Security</h2>
          <p class="mt-1 text-sm leading-6 text-slate-600">Manage your password and account security.</p>
        </div>
        <div class="border-t border-slate-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-900">Change Password</h3>
              <p class="mt-1 text-sm text-slate-500">Update the password associated with your account.</p>
            </div>
            <button class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
              Change
            </button>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center justify-between rounded-lg border border-slate-200 bg-white shadow-sm px-6 py-4">
        <div>
          <h3 class="text-sm font-medium text-slate-900">Sign Out</h3>
          <p class="mt-1 text-sm text-slate-500">Sign out of your current session.</p>
        </div>
        <button (click)="logout()" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
          Sign Out
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="rounded-lg border border-red-300 bg-red-50 shadow-sm">
        <div class="p-6">
          <h2 class="text-lg font-semibold leading-7 text-red-900">Danger Zone</h2>
          <p class="mt-1 text-sm leading-6 text-red-700">These actions are permanent and cannot be undone.</p>
        </div>
        <div class="border-t border-red-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-red-900">Delete Account</h3>
              <p class="mt-1 text-sm text-red-600">Permanently delete your account and all of your data.</p>
            </div>
            <button (click)="promptDeleteAccount()" class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Settings {
  protected authService = inject(AuthService);
  private modalService = inject(ModalService);
  private firestoreService = inject(FirestoreService);

  protected isUploading = signal(false);

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

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isUploading.set(true);

    try {
      await this.firestoreService.uploadProfileImage(file);
      this.modalService.showConfirm({
        type: 'success',
        title: 'Upload Successful',
        message: 'Your new profile picture has been saved.',
        confirmText: 'OK',
      });
    } catch (error) {
      console.error('Upload failed:', error);
      this.modalService.showConfirm({
        type: 'error',
        title: 'Upload Failed',
        message: 'There was a problem uploading your photo. Please try again.',
        confirmText: 'OK',
      });
    } finally {
      this.isUploading.set(false);
    }
  }

  protected async promptDeletePhoto(): Promise<void> {
    const confirmed = await this.modalService.showConfirm({
      type: 'warning',
      title: 'Remove Photo',
      message: 'Are you sure you want to remove your profile photo?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await this.firestoreService.deleteProfileImage();
        this.modalService.showConfirm({
          type: 'success',
          title: 'Photo Removed',
          message: 'Your profile photo has been successfully removed.',
          confirmText: 'OK',
        });
      } catch (error) {
        console.error('Failed to remove photo:', error);
        this.modalService.showConfirm({
          type: 'error',
          title: 'Removal Failed',
          message: 'There was a problem removing your photo. Please try again.',
          confirmText: 'OK',
        });
      }
    }
  }

  protected async logout(): Promise<void> {
    const confirmed = await this.modalService.showConfirm({
      type: 'warning',
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.authService.logout();
    }
  }

  protected async promptDeleteAccount(): Promise<void> {
    this.modalService.showConfirm({
      type: 'error',
      title: 'Delete Account',
      message: 'This feature is not yet implemented. Deleting your account will be permanent.',
      confirmText: 'I Understand',
    });
  }
}