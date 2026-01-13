import {
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
  afterNextRender,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderDocument } from '../../models/work-order.model';
import { WorkOrderService } from '../../services/work-order.service';
import { TimelineHeaderComponent } from '../timeline-header/timeline-header';
import { TimescalePickerComponent } from '../timescale-picker/timescale-picker';
import { WorkOrderFormComponent } from '../work-order-form/work-order-form';
import { WorkOrderBarComponent } from '../work-center-sidebar/work-order-bar';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    TimelineHeaderComponent,
    TimescalePickerComponent,
    WorkOrderFormComponent,
    WorkOrderBarComponent,
  ],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class TimelineComponent {
  private workOrderService = inject(WorkOrderService);

  // ViewChild signal to access the scroll container for "Center on Today"
  scrollContainer = viewChild.required<ElementRef>('scrollArea');

  // State Signals
  workCenters = this.workOrderService.workCenters;
  currentTimescale = signal<'Day' | 'Week' | 'Month'>('Month');
  hoveredRowId = signal<string | null>(null);
  selectedOrder = signal<WorkOrderDocument | null>(null);
  isDrawerOpen = signal(false);

  updateWorkOrderError = signal<string | null>(null);

  // Constants for our "Coordinate System"
  private readonly TIMELINE_START = new Date('2025-01-01').getTime();
  private readonly MS_PER_DAY = 24 * 60 * 60 * 1000;

  // Computed signal: Pixels per day changes based on zoom level
  pixelsPerDay = computed(() => {
    switch (this.currentTimescale()) {
      case 'Day':
        return 100;
      case 'Week':
        return 40;
      case 'Month':
        return 4;
      default:
        return 30;
    }
  });

  // Calculate total width based on the header's month logic
  totalGridWidth = computed(() => {
    // This must match your header's date-range logic exactly
    const daysInView = 365 * 2; // e.g., 2 years
    return daysInView * this.pixelsPerDay();
  });

  // Today's pixel offset for the red line indicator
  todayOffset = computed(() => {
    const daysFromStart = (Date.now() - this.TIMELINE_START) / this.MS_PER_DAY;
    return daysFromStart * this.pixelsPerDay();
  });

  constructor() {
    // Angular 21 hook: Runs after the DOM is rendered to handle initial scroll
    afterNextRender(() => {
      const scale = this.currentTimescale();
      this.scrollToCurrentMonth();
    });

    effect(() => {
      // We "track" these signals by reading them
      this.pixelsPerDay();
      const targetPos = this.monthMarkerLeft();

      // Use a small timeout to ensure the grid has recalculated its total
      // width in the DOM before we try to scroll to a specific pixel
      setTimeout(() => {
        this.scrollToPosition(targetPos);
      }, 50);
    });
  }

  private scrollToPosition(leftPos: number) {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    // Centers the marker in the middle of the viewport
    const centerOffset = container.clientWidth / 2;

    container.scrollTo({
      left: leftPos - centerOffset,
      behavior: 'smooth',
    });
  }

  // 1. Calculate the start of the month
  currentMonthStart = computed(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  });

  // 2. Calculate the pixel position relative to your TIMELINE_START
  monthMarkerLeft = computed(() => {
    const start = this.currentMonthStart();
    const timelineStart = new Date('2024-12-01T00:00:00'); // Your anchor date

    const diffMs = start.getTime() - timelineStart.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays * this.pixelsPerDay();
  });

  scrollToCurrentMonth() {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    // Use the signal you already created for the marker's position
    const targetLeft = this.monthMarkerLeft();

    // Center the line by subtracting half of the container width
    const scrollPosition = targetLeft - container.clientWidth / 2;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth', // Makes the transition feel high-end
    });
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

  // Handle clicking an existing bar
  openEditForm(order: WorkOrderDocument) {
    this.selectedOrder.set(order);
    this.isDrawerOpen.set(true);
  }

  // Handle clicking an empty spot
  openCreateForm(workCenterId: string, clickedDate: string) {
    this.selectedOrder.set({
      docId: '',
      docType: 'workOrder',
      data: {
        name: 'New Work Order',
        status: 'open',
        startDate: clickedDate,
        endDate: clickedDate, // Default to 1-day duration
        workCenterId: workCenterId,
      },
    });
    this.isDrawerOpen.set(true);
  }

  handleSaveOrder(updatedOrder: WorkOrderDocument) {
    const updateWorkOrderResult = this.workOrderService.upsertWorkOrder(updatedOrder);
    if (!updateWorkOrderResult.success) {
      // upsertWorkOrder.message may be undefined; use set with null fallback
      this.updateWorkOrderError.set(updateWorkOrderResult.message ?? 'An unknown error occurred.');
    } else {
      // clear previous error on success
      this.updateWorkOrderError.set(null);
      this.isDrawerOpen.set(false);
    }
  }
}
