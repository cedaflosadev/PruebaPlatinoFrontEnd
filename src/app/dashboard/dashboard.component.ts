import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ClientsModel } from "app/core/models/client.model";
import { ClientService } from "app/core/services/client.service";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SpinnerWaitComponent } from "app/partials/spinner-wait/spinner-wait.component";
import { ModalCreateUserComponent } from "app/partials/modal-create-user/modal-create-user.component";
import { ModalEditUserComponent } from "app/partials/modal-edit-user/modal-edit-user.component";
import { ModalConfirmEditUserComponent } from "app/partials/modal-confirm-edit-user/modal-confirm-edit-user.component";
import { ModalDeleteUserComponent } from "app/partials/modal-delete-user/modal-delete-user.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  public clients = [];

  public formCreateClient: FormGroup;
  public formCreateClientErrors: ClientsModel = new ClientsModel();

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    public father: AdminLayoutComponent,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.CreateForm();
    this.GetAllClients();
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
  public CreateForm() {
    this.formCreateClient = this.formBuilder.group({
      number_id: [
        { value: null, disabled: false },
        [Validators.required, this.father.ValidIDFormControl],
      ],
      name: [{ value: null, disabled: false }, [Validators.required]],
      birthday: [{ value: null, disabled: false }, [Validators.required]],
      email: [
        { value: null, disabled: false },
        [Validators.required, Validators.email],
      ],
      phone: [{ value: null, disabled: false }, [Validators.required]],
      address: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  public GetAllClients() {
    this.clientService.getClients().subscribe((data) => {
      this.clients = data.data;
    });
  }

  public CreateClient() {
    if (this.formCreateClient.valid) {
      //Levantar modal
      const dialogRef = this.dialog.open(ModalCreateUserComponent, {
        disableClose: true,
        maxWidth: "600px",
        data: this.formCreateClient.value,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.ConfirmCreateClient();
        }
      });
    } else {
      this.formCreateClient.markAllAsTouched();
    }
  }

  public ConfirmCreateClient() {
    this.clientService
      .createClient(this.formCreateClient.value)
      .subscribe((data) => {
        if (data) {
          this.openSnackBar(data.mensaje, "Continuar");
        }
        if (data.transaccion) {
          this.GetAllClients();
        }
      });
  }

  public EditClient(item: ClientsModel) {
    // llamar a un modal , enviar item y si confirma actualizar y obtener los resultados

    //Levantar modal
    const dialogRef1 = this.dialog.open(ModalEditUserComponent, {
      disableClose: true,
      maxWidth: "600px",
      autoFocus: false,
      maxHeight: "90vh",
      data: item,
    });

    dialogRef1.afterClosed().subscribe((result) => {
      if (result !== false) {
        // realizo la actualización con nuevo objeto
        const dialogRef2 = this.dialog.open(ModalConfirmEditUserComponent, {
          disableClose: true,
          maxWidth: "600px",
          autoFocus: false,
          maxHeight: "90vh",
          data: result,
        });
        dialogRef2.afterClosed().subscribe((response) => {
          if (response) {
            this.ConfirmEditClient(result);
          }
        });
      }
    });
  }

  public ConfirmEditClient(clientUpdate: ClientsModel) {
    this.clientService.updateClient(clientUpdate).subscribe((data) => {
      if (data) {
        this.openSnackBar(data.mensaje, "Continuar");
      }
      if (data.transaccion) {
        this.GetAllClients();
      }
    });
  }

  public DeleteClient(item: ClientsModel) {
    const dialogRef3 = this.dialog.open(ModalDeleteUserComponent, {
      disableClose: true,
      maxWidth: "600px",
      data: item,
    });
    dialogRef3.afterClosed().subscribe((result) => {
      if (result) {
        this.clientService.deleteClient(item).subscribe((data) => {
          if (data) {
            this.openSnackBar(data.mensaje, "Continuar");
          }
          if (data.transaccion) {
            this.GetAllClients();
          }
        });
      }
    });
  }
}
