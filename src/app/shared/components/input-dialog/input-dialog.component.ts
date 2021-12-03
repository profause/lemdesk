import { Component, OnInit, Input, TemplateRef, Inject, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { DataService } from '../../services/data.service';
import { DialogOptions, DialogService, DialogButton } from '../../services/dialog.service';
import { FormBuilderService } from '../../services/form-builder.service';

export interface FormInput {
  name: string
  value: string
  title: string
  dataType: string
  required: boolean
  defaultValue?: string
  validateField?: boolean
  sequence?: number
  listofValues?: string
  maxLength?: number
  minLength?: number
  errorMessage?: string
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit, OnDestroy {
  public observers = new Array<Subscription>();
  public isLoading = false;
  public formInputs: FormInput[] = [];
  public formInputGroup: FormGroup
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private dialogService: DialogService,
    private formBuilderService: FormBuilderService,
    private formBuilder: FormBuilder,
    private dataSource: DataService,
    private appMaterialDesignModule: AppMaterialDesignModule) {

  }

  ngOnInit() {
    this.formInputs = this.dialogOptions.data.sort((a, b) => (a.sequence || 1 > b.sequence || 1) ? 1 : -1);
    this.formInputGroup = this.formBuilder.group({
      formInput: this.formBuilderService.createFormInputs(this.formInputs)
    })
  }

  get formInput() {
    return this.formInputGroup.controls["formInput"] as FormArray;
  }

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  public onSubmit(): void {
    this.isLoading = true;
    this.dialogService.sendMessage({
      text: 'ok button clicked',
      button: DialogButton.ok, formInput: this.formInput.value
    });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

}
