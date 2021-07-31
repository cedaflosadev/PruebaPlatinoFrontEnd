import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsModel } from "app/core/models/client.model";

@Component({
  selector: "app-modal-create-user",
  templateUrl: "./modal-create-user.component.html",
  styles: [],
})
export class ModalCreateUserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalCreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientsModel
  ) {}

  ngOnInit(): void {}

  public CloseModal(isCorrect: boolean) {
    this.dialogRef.close(isCorrect);
  }
}
