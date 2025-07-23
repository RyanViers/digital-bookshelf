import { Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-client-only-chart',
  imports: [CommonModule, NgxChartsModule],
  template: `
    @if (isBrowser) {
      @switch (chartType) {
        @case ('line') {
          <ngx-charts-line-chart
            [results]="data"
            [xAxis]="true"
            [yAxis]="true"
            [showXAxisLabel]="true"
            [showYAxisLabel]="true"
            [xAxisLabel]="xAxisLabel"
            [yAxisLabel]="yAxisLabel"
            [timeline]="false"
            class="fill-available">
          </ngx-charts-line-chart>
        }
        @case ('pie') {
          <ngx-charts-pie-chart
            [results]="data"
            [doughnut]="true"
            [explodeSlices]="false"
            [labels]="true"
            [legend]="true"
            class="fill-available">
          </ngx-charts-pie-chart>
        }
      }
    } @else {
      <div class="text-center py-12 text-slate-400">
        <div class="text-4xl mb-4">📊</div>
        <p class="text-lg mb-2 text-slate-300">Loading chart...</p>
      </div>
    }
  `
})
export class ClientOnlyChart {
  @Input() chartType: 'line' | 'pie' = 'line';
  @Input() data: any[] = [];
  @Input() xAxisLabel: string = '';
  @Input() yAxisLabel: string = '';
  
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);
}
