/**
 * Represents the four allowed statuses for a work order.
 * Defined in the core requirements for the timeline bars.
 */
export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

/**
 * Base document structure required for all data entities.
 */
interface BaseDocument {
  docId: string;
  docType: string;
}

/**
 * Work Center model representing production lines or machines.
 */
export interface WorkCenterDocument extends BaseDocument {
  docType: 'workCenter';
  data: {
    name: string; // e.g., "CNC Machine 1" or "Assembly Station"
  };
}

/**
 * Work Order model representing a scheduled task.
 * Includes references to work centers and date ranges.
 */
export interface WorkOrderDocument extends BaseDocument {
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string; // ISO format: "YYYY-MM-DD"
    endDate: string; // ISO format: "YYYY-MM-DD"
  };
}
