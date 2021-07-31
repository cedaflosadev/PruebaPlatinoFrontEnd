import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-spinner-wait",
  templateUrl: "./spinner-wait.component.html",
  styles: [],
})
export class SpinnerWaitComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SpinnerWaitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
