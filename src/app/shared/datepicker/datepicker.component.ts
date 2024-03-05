import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DatepickerComponent {
  @Input() name: string;
  @Input() id: string;
  @Input() isRequired: boolean;

  @Output() dateEmitter: EventEmitter<Date> = new EventEmitter<Date>();

  onDateChange(event: any) {
    this.dateEmitter.emit(event.target.value);
  }
}
