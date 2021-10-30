import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AccountModel } from "../../../core/models/account.model";

@Component({
  selector: "app-modal-confirm-delete-plan",
  templateUrl: "./modal-confirm-delete-plan.component.html",
  styles: [],
})
export class ModalConfirmDeletePlanComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmDeletePlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountModel
  ) {}

  ngOnInit(): void {}

  public CloseModal(isCorrect: boolean) {
    isCorrect
      ? this.dialogRef.close(this.data)
      : this.dialogRef.close(isCorrect);
  }
}
