import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientsModel } from "app/core/models/client.model";
import { ClientService } from "app/core/services/client.service";

@Component({
  selector: "app-modal-edit-user",
  templateUrl: "./modal-edit-user.component.html",
  styles: [],
})
export class ModalEditUserComponent implements OnInit {
  public formUpdateClient: FormGroup;
  public formUpdateClientClientErrors: ClientsModel = new ClientsModel();
  constructor(
    public dialogRef: MatDialogRef<ModalEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientsModel,
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.CreateForm();
  }

  public CloseModal(isCorrect: boolean) {
    if (isCorrect) {
      if (this.formUpdateClient.valid) {
        if (
          this.data.number_id ===
          this.formUpdateClient.controls["number_id"].value
        ) {
          this.dialogRef.close(this.formUpdateClient.value);
        } else {
          console.log(this.formUpdateClient.controls["number_id"].value);
          this.clientService
            .getOneClient(this.formUpdateClient.controls["number_id"].value)
            .subscribe((data) => {
              if (data.data.length === 0) {
                this.dialogRef.close(this.formUpdateClient.value);
              } else {
                // alert("Número de Cédula ya registrado");
                this.openSnackBar("Número de Cédula ya registrado", "Continuar");
              }
            });
        }
      } else {
        this.formUpdateClient.markAllAsTouched();
      }
    } else {
      this.dialogRef.close(isCorrect);
    }
  }
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public CreateForm() {
    this.formUpdateClient = this.formBuilder.group({
      _id: [{ value: this.data._id, disabled: false }, [Validators.required]],
      number_id: [
        { value: this.data.number_id, disabled: false },
        [Validators.required, this.ValidIDFormControl],
      ],
      name: [{ value: this.data.name, disabled: false }, [Validators.required]],
      birthday: [
        { value: this.data.birthday, disabled: false },
        [Validators.required],
      ],
      email: [
        { value: this.data.email, disabled: false },
        [Validators.required, Validators.email],
      ],
      phone: [
        { value: this.data.phone, disabled: false },
        [Validators.required],
      ],
      address: [
        { value: this.data.address, disabled: false },
        [Validators.required],
      ],
    });
  }

  public ValidIDFormControl(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const cedulaident: any = control.value;

    if (cedulaident) {
      if (cedulaident.length == 10) {
        var cad = cedulaident;

        var total = 0;

        var longitud = cad.length;

        var longcheck = longitud - 1;

        if (cad !== "" && longitud === 10) {
          for (var i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
              var aux = cad.charAt(i) * 2;

              if (aux > 9) aux -= 9;

              total += aux;
            } else {
              total += parseInt(cad.charAt(i));
            }
          }

          total = total % 10 ? 10 - (total % 10) : 0;

          if (cad.charAt(longitud - 1) == total) {
            return null;
          } else {
            return { ValidIDFormControl: true };
          }
        }
      } else {
        return { ValidIDFormControl: true };
      }
    } else {
      return { ValidIDFormControl: true };
    }
  }
  public GroupFormGeneralisControlHasError(
    formGeneral: FormGroup,
    controlName: string,
    errorsArrayGeneral: any
  ): boolean {
    const control = formGeneral.controls[controlName];
    if (!control) {
      return false;
    }

    if (control.errors) {
      const result =
        (control.hasError(control.errors[Object.keys(control.errors)[0]]) &&
          control.dirty) ||
        control.touched;

      const messageError = control.errors.required
        ? "* Campo es requerido"
        : control.errors.ValidIDFormControl
        ? "* Cédula no válida"
        : control.errors.email
        ? "* Correo no válido"
        : null;

      errorsArrayGeneral[controlName] = messageError;

      return result;
    }

    return false;
  }
}
