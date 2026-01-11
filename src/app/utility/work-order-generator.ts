import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';

export const MOCK_WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Genesis Hardware' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'Rodriques Electrics' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Konsulting Inc' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'McMarrow Distribution' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Spartan Manufacturing' } },
];

export const generateMockData = (count: number): WorkOrderDocument[] => {
  const statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
  const workOrders: WorkOrderDocument[] = [];

  // Start from a fixed date to ensure consistency
  const baseDate = new Date('2025-08-01');

  for (let i = 0; i < count; i++) {
    const wc = MOCK_WORK_CENTERS[i % MOCK_WORK_CENTERS.length];

    // Randomize duration between 2 and 10 days
    const duration = Math.floor(Math.random() * 8) + 2;

    // Stagger start dates to avoid massive overlaps for initial testing
    // (Though your overlap detection will eventually flag these)
    const startOffset = Math.floor(i / MOCK_WORK_CENTERS.length) * 5;
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + startOffset);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    workOrders.push({
      docId: `wo-${i}`,
      docType: 'workOrder',
      data: {
        name: `Work Order #${i + 1}`,
        workCenterId: wc.docId,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    });
  }

  return workOrders;
};
