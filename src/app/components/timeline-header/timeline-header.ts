import { CommonModule } from '@angular/common';
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-timeline-header',
  imports: [CommonModule],
  templateUrl: './timeline-header.html',
  styleUrls: ['./timeline-header.scss'],
})
export class TimelineHeaderComponent {
  pixelsPerDay = input.required<number>();

  // Ensure this matches your generator anchor
  readonly START_DATE = new Date('2024-12-01T00:00:00');

  headerSegments = computed(() => {
    const segments = [];
    const current = new Date(this.START_DATE);
    const pxPerDay = this.pixelsPerDay();

    for (let i = 0; i < 24; i++) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      segments.push({
        // Change 'long' to 'short' for abbreviated names
        label: current.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        width: daysInMonth * pxPerDay,
        date: new Date(current),
      });

      current.setMonth(current.getMonth() + 1);
    }
    return segments;
  });
}
