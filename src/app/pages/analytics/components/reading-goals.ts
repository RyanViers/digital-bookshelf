import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AnalyticsService } from '../analytics.service';
import { ModalService } from '../../../shared/modals/modals.service';
import { NewReadingGoal } from '../analytics.models';

@Component({
  selector: 'app-reading-goals',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Add New Goal Button -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-white">Reading Goals for {{ analyticsService.selectedYear() }}</h2>
        <button 
          (click)="showGoalForm = !showGoalForm"
          class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors">
          {{ showGoalForm ? 'Cancel' : 'Add Goal' }}
        </button>
      </div>

      <!-- Goal Creation Form -->
      @if (showGoalForm) {
        <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-white mb-4">Create New Goal</h3>
          <form [formGroup]="goalForm" (ngSubmit)="createGoal()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="type" class="block text-sm font-medium text-slate-300">Goal Type</label>
                <select 
                  id="type"
                  formControlName="type" 
                  class="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-100 px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400">
                  <option value="books" class="bg-slate-700">Books</option>
                  <option value="pages" class="bg-slate-700">Pages</option>
                  <option value="minutes" class="bg-slate-700">Reading Time (minutes)</option>
                </select>
              </div>
              <div>
                <label for="target" class="block text-sm font-medium text-slate-300">Target</label>
                <input 
                  id="target"
                  type="number"
                  formControlName="target"
                  min="1"
                  class="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-slate-100 px-3 py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  placeholder="Enter your target">
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button 
                type="button"
                (click)="showGoalForm = false"
                class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors">
                Cancel
              </button>
              <button 
                type="submit"
                [disabled]="goalForm.invalid || analyticsService.isGoalsLoading()"
                class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {{ analyticsService.isGoalsLoading() ? 'Creating...' : 'Create Goal' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Goals List -->
      @if (analyticsService.goals() && analyticsService.readingGoalProgress().length > 0) {
        <div class="space-y-4">
          @for (goalProgress of analyticsService.readingGoalProgress(); track goalProgress.goal.id) {
            <div class="rounded-lg bg-slate-800 border border-slate-700 p-6 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    {{ goalProgress.goal.target | number }} {{ getGoalTypeLabel(goalProgress.goal.type) }}
                  </h3>
                  <p class="text-sm text-slate-400">
                    {{ goalProgress.goal.current | number }} / {{ goalProgress.goal.target | number }}
                    ({{ goalProgress.percentage | number:'1.0-1' }}%)
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  @if (goalProgress.onTrack) {
                    <span class="inline-flex items-center rounded-full bg-emerald-900/50 border border-emerald-600 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      On Track
                    </span>
                  } @else {
                    <span class="inline-flex items-center rounded-full bg-red-900/50 border border-red-600 px-2.5 py-0.5 text-xs font-medium text-red-400">
                      Behind
                    </span>
                  }
                  <button 
                    (click)="deleteGoal(goalProgress.goal.id)"
                    class="text-red-400 hover:text-red-300 text-sm transition-colors">
                    Delete
                  </button>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-slate-700 rounded-full h-2 mb-4">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  [class.bg-emerald-500]="goalProgress.onTrack"
                  [class.bg-red-500]="!goalProgress.onTrack"
                  [style.width.%]="goalProgress.percentage">
                </div>
              </div>

              <!-- Additional Info -->
              @if (goalProgress.remaining > 0) {
                <div class="text-sm text-slate-400">
                  <p>{{ goalProgress.remaining | number }} remaining to reach your goal</p>
                  @if (goalProgress.projectedCompletion) {
                    <p>Projected completion: {{ goalProgress.projectedCompletion | date:'mediumDate' }}</p>
                  }
                </div>
              } @else {
                <div class="text-sm text-emerald-400 font-medium">
                  🎉 Goal achieved! Congratulations!
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="text-slate-400 text-6xl mb-4">🎯</div>
          <h3 class="text-lg font-medium text-white mb-2">No reading goals set</h3>
          <p class="text-slate-400 mb-4">Set a reading goal to track your progress throughout the year.</p>
          <button 
            (click)="showGoalForm = true"
            class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors">
            Create Your First Goal
          </button>
        </div>
      }
    </div>
  `
})
export class ReadingGoals {
  protected analyticsService = inject(AnalyticsService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  protected showGoalForm = false;

  protected goalForm = this.fb.group({
    type: this.fb.control<'books' | 'pages' | 'minutes'>('books', Validators.required),
    target: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  protected getGoalTypeLabel(type: 'books' | 'pages' | 'minutes'): string {
    switch (type) {
      case 'books': return 'Books';
      case 'pages': return 'Pages';
      case 'minutes': return 'Minutes';
      default: return '';
    }
  }

  protected async createGoal(): Promise<void> {
    if (this.goalForm.invalid) return;

    const formValue = this.goalForm.getRawValue();
    const newGoal: NewReadingGoal = {
      year: this.analyticsService.selectedYear(),
      type: formValue.type!,
      target: formValue.target!
    };

    try {
      await this.analyticsService.createGoal(newGoal);
      this.showGoalForm = false;
      this.goalForm.reset();
      this.modalService.showConfirm({
        type: 'success',
        title: 'Goal Created!',
        message: 'Your reading goal has been set. Good luck!',
        confirmText: 'OK'
      });
    } catch (error) {
      this.modalService.showConfirm({
        type: 'error',
        title: 'Error',
        message: 'Failed to create goal. Please try again.',
        confirmText: 'OK'
      });
    }
  }

  protected async deleteGoal(goalId: string): Promise<void> {
    const confirmed = await this.modalService.showConfirm({
      type: 'warning',
      title: 'Delete Goal',
      message: 'Are you sure you want to delete this reading goal? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      try {
        await this.analyticsService.deleteGoal(goalId);
        this.modalService.showConfirm({
          type: 'success',
          title: 'Goal Deleted',
          message: 'Your reading goal has been removed.',
          confirmText: 'OK'
        });
      } catch (error) {
        this.modalService.showConfirm({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete goal. Please try again.',
          confirmText: 'OK'
        });
      }
    }
  }
}
