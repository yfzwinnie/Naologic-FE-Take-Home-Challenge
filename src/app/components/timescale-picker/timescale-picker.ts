import { Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaretIcon } from '../caret-icon/caret-icon';

export type TimescaleType = 'Day' | 'Week' | 'Month';

@Component({
  selector: 'app-timescale-picker',
  imports: [CommonModule, CaretIcon],
  templateUrl: './timescale-picker.html',
  styleUrl: './timescale-picker.scss',
})
export class TimescalePickerComponent {
  currentScale = input.required<TimescaleType>();
  scaleChange = output<TimescaleType>();

  // Use a signal for UI state for better performance
  isOpen = signal(false);
  options: TimescaleType[] = ['Day', 'Week', 'Month'];

  constructor(private eRef: ElementRef) {}

  /**
   * Closes the dropdown if a click occurs outside the component
   */
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleMenu() {
    this.isOpen.update((v) => !v);
  }

  selectOption(option: TimescaleType) {
    this.scaleChange.emit(option);
    this.isOpen.set(false);
  }
}
