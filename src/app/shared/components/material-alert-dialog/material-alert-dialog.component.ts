import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-material-alert-dialog',
  templateUrl: './material-alert-dialog.component.html',
  styleUrls: ['./material-alert-dialog.component.scss']
})
export class MaterialAlertDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MaterialAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  hideAlertDialog(): void {
    this.dialogRef.close();
  }

}
