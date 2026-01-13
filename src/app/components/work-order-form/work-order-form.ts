import { Component, input, output, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WorkOrderDocument,
  WorkOrderFormModel,
  WorkOrderStatus,
} from '../../models/work-order.model';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

type WorkOrderFormState = {
  name: string;
  status: WorkOrderStatus | string;
  startDate: NgbDateStruct | null;
  endDate: NgbDateStruct | null;
  workCenterId?: string;
};

@Component({
  selector: 'app-work-order-form',
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-form.html',
  styleUrls: ['./work-order-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderFormComponent {
  isOpen = input.required<boolean>();
  order = input<WorkOrderDocument | null>(null);
  updateError = input<string | null>(null);

  close = output<void>();
  save = output<WorkOrderDocument>();

  statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'complete', label: 'Complete' },
  ];

  formData = signal<{
    name: string;
    status: WorkOrderStatus | string;
    startDate: NgbDateStruct | null;
    endDate: NgbDateStruct | null;
    workCenterId?: string;
  }>({
    name: '',
    status: 'open',
    startDate: null,
    endDate: null,
  });

  constructor() {
    // Whenever the 'order' input changes, update the local form data
    effect(() => {
      const selected = this.order();
      if (selected) {
        this.formData.set({
          name: selected.data.name,
          status: selected.data.status,
          startDate: this.toNgbDate(selected.data.startDate),
          endDate: this.toNgbDate(selected.data.endDate),
        });
      }
    });
  }

  // Convert "2025-12-23" to {year: 2025, month: 12, day: 23}
  private toNgbDate(dateStr: string): NgbDateStruct {
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
  }

  // Convert {year: 2025, month: 12, day: 23} to "2025-12-23"
  private fromNgbDate(date: NgbDateStruct | null): string {
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(
      2,
      '0'
    )}`;
  }

  onSave() {
    const currentOrder = this.order();
    if (!currentOrder) return;

    const updatedOrder: WorkOrderDocument = {
      ...currentOrder,
      data: {
        ...currentOrder.data,
        name: this.formData().name,
        status: this.formData().status as WorkOrderStatus,
        startDate: this.fromNgbDate(this.formData().startDate),
        endDate: this.fromNgbDate(this.formData().endDate),
      },
    };

    this.save.emit(updatedOrder);
  }

  updateFormData(updates: Partial<WorkOrderFormState>) {
    this.formData.update((f) => ({ ...f, ...updates }));
  }
}
