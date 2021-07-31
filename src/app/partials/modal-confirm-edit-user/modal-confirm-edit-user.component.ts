import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsModel } from "app/core/models/client.model";
import { ClientService } from "app/core/services/client.service";

@Component({
  selector: "app-modal-confirm-edit-user",
  templateUrl: "./modal-confirm-edit-user.component.html",
  styles: [],
})
export class ModalConfirmEditUserComponent implements OnInit {
  public formUpdateClient: FormGroup;
  public formUpdateClientClientErrors: ClientsModel = new ClientsModel();
  constructor(
    public dialogRef: MatDialogRef<ModalConfirmEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientsModel,
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {}

  public CloseModal(isCorrect: boolean) {
    this.dialogRef.close(isCorrect);
  }
}
