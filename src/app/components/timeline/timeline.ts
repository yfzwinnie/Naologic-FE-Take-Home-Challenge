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

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    TimelineHeaderComponent,
    TimescalePickerComponent,
    WorkOrderFormComponent,
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
        return 5;
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
      const scale = this.currentTimescale();
      this.scrollToToday(scale);
    });

    effect(() => {
      const scale = this.currentTimescale();
      this.scrollToToday(scale);
    });
  }

  // scrollToToday() {
  //   const container = this.scrollContainer().nativeElement;
  //   const centerShift = container.clientWidth / 2;
  //   container.scrollLeft = this.todayOffset() - centerShift;
  // }

  scrollToToday(scale: string) {
    const scrollContainer = this.scrollContainer()?.nativeElement;
    if (!scrollContainer) return;

    const now = new Date();
    // Calculate the 'left' position of 'Now' using the same math as your bars
    const msFromAnchor = now.getTime() - this.TIMELINE_START;
    const daysFromAnchor = msFromAnchor / (1000 * 60 * 60 * 24);
    const targetLeft = daysFromAnchor * this.pixelsPerDay();

    // Center the current time in the middle of the screen
    const scrollOffset = targetLeft - scrollContainer.clientWidth / 2;

    scrollContainer.scrollTo({
      left: scrollOffset,
      behavior: 'smooth', // Provides that polished ERP feel
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
