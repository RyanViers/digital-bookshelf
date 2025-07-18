// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from './shared/modals/modals';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent],
  template: `
    <router-outlet />
    <app-modal /> 
  `,
})
export class App {}