import { Injectable } from '@angular/core';
import { generateMockData } from '../utility/work-order-generator';
import { Observable, of } from 'rxjs';
import { WorkOrderDocument } from '../models/work-order.model';

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  getUsers(): Observable<WorkOrderDocument[]> {
    const mockWorkOrders: WorkOrderDocument[] = generateMockData(1000);
    return of(mockWorkOrders);
  }
}
