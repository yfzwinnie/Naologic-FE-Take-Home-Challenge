import { Component, computed, input } from '@angular/core';
import { WorkCenterDocument, WorkOrderDocument } from '../../models/work-order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-order-bar',
  imports: [CommonModule],
  templateUrl: './work-order-bar.html',
  styleUrls: ['./work-order-bar.scss'],
})
export class WorkOrderBarComponent {
  order = input.required<WorkOrderDocument>();
  pixelsPerDay = input.required<number>();

  // The global anchor date
  readonly TIMELINE_START = new Date('2024-12-01T00:00:00');

  // Reactively calculate styles whenever inputs change
  barStyles = computed(() => {
    const data = this.order().data;
    const start = new Date(data.startDate + 'T00:00:00');
    const end = new Date(data.endDate + 'T00:00:00');
    const pxPerDay = this.pixelsPerDay();

    // 1. Calculate horizontal position (Left)
    const diffMs = start.getTime() - this.TIMELINE_START.getTime();
    const daysFromStart = diffMs / (1000 * 60 * 60 * 24);
    const left = daysFromStart * pxPerDay;

    // 2. Calculate length (Width)
    const durationMs = end.getTime() - start.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24) + 1; // +1 to include end day
    const width = durationDays * pxPerDay;

    return {
      'left.px': left,
      'width.px': width,
    };
  });

  // Get status color for the badge
  statusClass = computed(() => `status-${this.order().data.status}`);
}
