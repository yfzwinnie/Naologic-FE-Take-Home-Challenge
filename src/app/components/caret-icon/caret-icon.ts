import { Component, input } from '@angular/core';

@Component({
  selector: 'app-caret-icon',
  imports: [],
  templateUrl: './caret-icon.html',
  styleUrl: './caret-icon.scss',
})
export class CaretIcon {
  isExpanded = input<boolean>(false);
}
