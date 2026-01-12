import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from '../models/work-order.model';

export const MOCK_WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Genesis Hardware' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'Rodriques Electrics' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Konsulting Inc' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'McMarrow Distribution' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Spartan Manufacturing' } },
];

export function generateInitialWorkOrders(count: number): WorkOrderDocument[] {
  const statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];
  const workOrders: WorkOrderDocument[] = [];

  // Create a tracking object for each Work Center's timeline
  const nextAvailableDatePerWC: Record<string, Date> = {};

  MOCK_WORK_CENTERS.forEach((wc) => {
    // Start generating from a fixed point in the past
    const startPoint = new Date('2024-12-01');
    nextAvailableDatePerWC[wc.docId] = startPoint;
  });

  for (let i = 0; i < count; i++) {
    // Rotate through Work Centers (0, 1, 2, 3, 4, 0, 1...)
    const wc = MOCK_WORK_CENTERS[i % MOCK_WORK_CENTERS.length];

    // 1. Retrieve the specific cursor for this machine
    const startDate = new Date(nextAvailableDatePerWC[wc.docId]);

    // 1. Random gap between orders (0 to 10 days)
    const gap = Math.floor(Math.random() * 10);
    startDate.setDate(startDate.getDate() + gap);

    // 2. INCREASED DURATION: Spans multiple months (20 to 90 days)
    const duration = Math.floor(Math.random() * 70) + 20;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);

    workOrders.push({
      docId: `wo-${i}`,
      docType: 'workOrder',
      data: {
        name: MOCK_WORK_CENTERS[Math.floor(Math.random() * MOCK_WORK_CENTERS.length)].data.name,
        workCenterId: wc.docId,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    });

    // 3. Update cursor for the next order on this machine
    const nextStart = new Date(endDate);
    nextStart.setDate(nextStart.getDate() + 1);
    nextAvailableDatePerWC[wc.docId] = nextStart;
  }

  return workOrders;
}
