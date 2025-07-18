import { Injectable, signal } from '@angular/core';
import { ModalConfig } from './modals.models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  /**
   * A signal that holds the current modal configuration.
   * When null, the modal is hidden. When it has a value, the modal is shown.
   */
  public config = signal<ModalConfig | null>(null);

  /**
   * A private signal to manage the result of a confirmation modal.
   * This is used internally to bridge the user's action (click) with the calling code.
   */
  private confirmationResult = signal<{ resolve: (value: boolean) => void } | null>(null);

  /**
   * Shows a confirmation modal and returns a Promise that resolves with
   * `true` if the user confirms, or `false` if they cancel.
   * @param config The configuration for the modal.
   * @returns A promise that resolves with the user's choice.
   */
  public showConfirm(config: ModalConfig): Promise<boolean> {
    this.config.set(config);
    return new Promise((resolve) => {
      this.confirmationResult.set({ resolve });
    });
  }

  /**
   * Hides the modal from view.
   */
  public hide(): void {
    this.config.set(null);
    this.confirmationResult.set(null);
  }

  /**
   * Called by the modal component when the user clicks the confirm button.
   * It resolves the pending promise with `true` and hides the modal.
   */
  public confirm(): void {
    this.confirmationResult()?.resolve(true);
    this.hide();
  }

  /**
   * Called by the modal component when the user clicks the cancel button.
   * It resolves the pending promise with `false` and hides the modal.
   */
  public cancel(): void {
    this.confirmationResult()?.resolve(false);
    this.hide();
  }
}