import {
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderDocument } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class TimelineComponent {
  private workOrderService = inject(WorkOrderService);

  // ViewChild signal to access the scroll container for "Center on Today"
  scrollContainer = viewChild.required<ElementRef>('scrollArea');

  // State Signals
  workCenters = this.workOrderService.workCenters;
  currentTimescale = signal<'Day' | 'Week' | 'Month'>('Day');
  hoveredRowId = signal<string | null>(null);

  // Constants for our "Coordinate System"
  private readonly TIMELINE_START = new Date('2025-01-01').getTime();
  private readonly MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Computed signal: Pixels per day changes based on zoom level
  pixelsPerDay = computed(() => {
    switch (this.currentTimescale()) {
      case 'Day':
        return 100;
      case 'Week':
        return 30;
      case 'Month':
        return 8;
      default:
        return 30;
    }
  });

  // Today's pixel offset for the red line indicator
  todayOffset = computed(() => {
    const daysFromStart = (Date.now() - this.TIMELINE_START) / this.MS_PER_DAY;
    return daysFromStart * this.pixelsPerDay();
  });

  constructor() {
    // Angular 21 hook: Runs after the DOM is rendered to handle initial scroll
    afterNextRender(() => {
      this.scrollToToday();
    });
  }

  scrollToToday() {
    const container = this.scrollContainer().nativeElement;
    const centerShift = container.clientWidth / 2;
    container.scrollLeft = this.todayOffset() - centerShift;
  }

  getOrdersForRow(wcId: string) {
    // Efficiently filters the 1000 orders for this specific row
    return this.workOrderService.workOrders().filter((o) => o.data.workCenterId === wcId);
  }

  calculateBarStyles(order: WorkOrderDocument) {
    const start = new Date(order.data.startDate).getTime();
    const end = new Date(order.data.endDate).getTime();

    const left = ((start - this.TIMELINE_START) / this.MS_PER_DAY) * this.pixelsPerDay();
    const width = ((end - start) / this.MS_PER_DAY) * this.pixelsPerDay();

    return {
      left: `${left}px`,
      width: `${width}px`,
    };
  }
}
