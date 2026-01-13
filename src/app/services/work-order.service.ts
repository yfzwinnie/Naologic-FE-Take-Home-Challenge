import { Injectable, signal, computed } from '@angular/core';
import { WorkOrderDocument, WorkCenterDocument } from '../models/work-order.model';
import { generateInitialWorkOrders, MOCK_WORK_CENTERS } from '../utility/work-order-generator';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  readonly workCenters = signal<WorkCenterDocument[]>(MOCK_WORK_CENTERS);
  private readonly _workOrders = signal<WorkOrderDocument[]>(generateInitialWorkOrders(1000));

  readonly workOrders = this._workOrders.asReadonly();

  /**
   * Overlap Detection Logic
   * Uses the formula: (StartA < EndB) AND (EndA > StartB)
   */
  checkOverlap(
    workCenterId: string,
    newStart: string,
    newEnd: string,
    excludeId?: string
  ): boolean {
    const start = new Date(newStart).getTime();
    const end = new Date(newEnd).getTime();

    return this._workOrders().some((order) => {
      // Only check orders in the same Work Center, excluding the one we are editing
      if (order.data.workCenterId !== workCenterId || order.docId === excludeId) {
        return false;
      }

      const s = new Date(order.data.startDate).getTime();
      const e = new Date(order.data.endDate).getTime();

      return start < e && end > s;
    });
  }

  upsertWorkOrder(order: Partial<WorkOrderDocument>): { success: boolean; message?: string } {
    const isOverlap = this.checkOverlap(
      order.data!.workCenterId,
      order.data!.startDate,
      order.data!.endDate,
      order.docId
    );

    if (isOverlap) {
      return { success: false, message: 'This machine is already booked for these dates.' };
    }

    this._workOrders.update((current) => {
      const index = current.findIndex((o) => o.docId === order.docId);
      if (index > -1) {
        const updated = [...current];
        updated[index] = { ...current[index], ...order } as WorkOrderDocument;
        return updated;
      } else {
        return [...current, order as WorkOrderDocument];
      }
    });

    return { success: true };
  }

  deleteWorkOrder(docId: string) {
    this._workOrders.update((current) => current.filter((o) => o.docId !== docId));
  }
}
