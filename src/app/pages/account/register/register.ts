import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ModalService } from '../../../shared/modals/modals.service';

// Custom validator to check if passwords match
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-900 p-4">
      <!-- Animated Gradient Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 opacity-80"></div>
        <svg class="absolute inset-0 h-full w-full" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="60" />
            </filter>
          </defs>
          <g filter="url(#blur)">
            <circle cx="10%" cy="30%" r="200" fill="#0e7490" class="animate-orb1" />
            <circle cx="80%" cy="70%" r="250" fill="#0891b2" class="animate-orb2" />
            <circle cx="40%" cy="10%" r="150" fill="#4f46e5" class="animate-orb3" />
            <circle cx="90%" cy="90%" r="220" fill="#67e8f9" class="animate-orb4" />
          </g>
        </svg>
      </div>

      <!-- Glassmorphism Card -->
      <div class="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3">
            <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            <span class="text-2xl font-bold text-white">Bookshelf</span>
          </div>
          <h2 class="mt-6 text-3xl font-bold tracking-tight text-white">Create your account</h2>
          <p class="mt-2 text-sm text-white/70">
            Already a member?
            <a routerLink="/login" class="font-semibold text-white hover:underline">Sign in here</a>
          </p>
        </div>
        
        <div class="mt-8">
          <form [formGroup]="registerForm" (ngSubmit)="register()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-white/80">Email address</label>
              <div class="mt-2">
                <input formControlName="email" id="email" type="email" class="block w-full rounded-md border-0 bg-white/10 p-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/50 focus:ring-2 focus:ring-inset focus:ring-white">
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-white/80">Password</label>
              <div class="mt-2">
                <input formControlName="password" id="password" type="password" class="block w-full rounded-md border-0 bg-white/10 p-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/50 focus:ring-2 focus:ring-inset focus:ring-white">
              </div>
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-white/80">Confirm Password</label>
              <div class="mt-2">
                <input formControlName="confirmPassword" id="confirmPassword" type="password" class="block w-full rounded-md border-0 bg-white/10 p-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/50 focus:ring-2 focus:ring-inset focus:ring-white">
              </div>
              @if (registerForm.hasError('passwordsMismatch')) {
                <p class="mt-2 text-sm text-pink-300">Passwords do not match.</p>
              }
            </div>
            <div>
              <button type="submit" [disabled]="registerForm.invalid" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-400 disabled:opacity-50">Create Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes moveOrb1 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(300px, -100px) scale(1.3); }
      100% { transform: translate(-100px, 200px) scale(0.8); }
    }
    @keyframes moveOrb2 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-350px, 150px) scale(0.7); }
      100% { transform: translate(100px, -250px) scale(1.1); }
    }
    @keyframes moveOrb3 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(250px, 200px) scale(1.2); }
      100% { transform: translate(-200px, -150px) scale(0.9); }
    }
    @keyframes moveOrb4 {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-200px, -200px) scale(1.1); }
      100% { transform: translate(250px, 180px) scale(1); }
    }
    .animate-orb1 { animation: moveOrb1 22s infinite alternate; }
    .animate-orb2 { animation: moveOrb2 28s infinite alternate; }
    .animate-orb3 { animation: moveOrb3 20s infinite alternate; }
    .animate-orb4 { animation: moveOrb4 24s infinite alternate; }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  protected registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatchValidator });

  public async register(): Promise<void> {
    if (this.registerForm.invalid) return;
    try {
      const { email, password } = this.registerForm.getRawValue();
      await this.authService.register(email!, password!);
      
      await this.modalService.showConfirm({
        type: 'success',
        title: 'Registration Successful!',
        message: 'Your account has been created. Please proceed to the login page.',
        confirmText: 'Go to Login',
      });

      this.router.navigate(['/login']);

    } catch (error: any) {
      let message = 'An unknown error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email address is already in use by another account.';
      }
      this.modalService.showConfirm({
        type: 'error',
        title: 'Registration Failed',
        message: message,
        confirmText: 'OK',
      });
    }
  }
}