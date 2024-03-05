import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ControlContainer, FormGroup, NgForm } from '@angular/forms';
import { stringify } from 'querystring';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FileUploadComponent {
  @Input() id: string;
  @Input() name: string;
  @Input() isRequired: boolean;

  @Output() filesSelectedEmitter: EventEmitter<File[]> = new EventEmitter<File[]>();

  onFileSelected(event: any): void {
    const filesSelected: File [] = [];
    const files: FileList = event.target.files;
    if (files.length > 0) {
      for (let i=0; i<files.length; i++) {
        filesSelected.push(files[i]);
      }
    }
    this.filesSelectedEmitter.emit(filesSelected);
  }
}
