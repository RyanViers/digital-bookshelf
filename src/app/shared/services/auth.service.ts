import { inject, Injectable, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  // --- Public State Signals ---

  /**
   * A signal that holds the current authenticated user object from Firebase,
   * or null if the user is logged out. This is a real-time signal.
   */
  public currentUser = toSignal(authState(this.auth), { initialValue: null as User | null });

  /**
   * A computed signal that is true if the user is currently logged in.
   * This is derived from the currentUser signal.
   */
  public isLoggedIn = computed(() => this.currentUser() !== null);

  // --- Authentication Methods ---

  public async register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public async login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public async logout(): Promise<void> {
    await signOut(this.auth);
    // Redirect to the login page after logout for a clean user experience.
    this.router.navigate(['/login']);
  }
}