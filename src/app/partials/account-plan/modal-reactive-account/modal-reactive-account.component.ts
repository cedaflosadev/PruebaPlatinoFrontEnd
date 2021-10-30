import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountingsService } from "app/core/services/accounting.service";

@Component({
  selector: "app-modal-reactive-account",
  templateUrl: "./modal-reactive-account.component.html",
  styles: [],
})
export class ModalReactiveAccountComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalReactiveAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private accountService: AccountingsService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
  public CloseModal(isCorrect: boolean) {
    if (isCorrect) {
      this.dialogRef.close(isCorrect);
    } else {
      this.dialogRef.close(isCorrect);
    }
  }
}
