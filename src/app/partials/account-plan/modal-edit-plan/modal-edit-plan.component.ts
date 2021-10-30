import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountModel } from "app/core/models/account.model";
import { TypeAccountModel } from "app/core/models/types-account.model";
import { AccountingsService } from "../../../core/services/accounting.service";
import { TypeAccountingService } from "../../../core/services/type-account.service";

@Component({
  selector: "app-modal-edit-plan",
  templateUrl: "./modal-edit-plan.component.html",
  styles: [],
})
export class ModalEditPlanComponent implements OnInit {
  public formUpdateAccount: FormGroup;
  public formUpdateAccountErrors: AccountModel = new AccountModel();
  public typesAccount: TypeAccountModel[];
  public selected: number;

  constructor(
    public dialogRef: MatDialogRef<ModalEditPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private typeAccountService: TypeAccountingService
  ) {}

  ngOnInit(): void {
    this.CreateForm();
    this.GetTypesAccounts();
  }

  public CreateForm() {
    this.formUpdateAccount = this.formBuilder.group({
      _id_account: [{ value: this.data._id_account, disabled: false }, [Validators.required]],
      id_account: [
        { value: this.data.id_account, disabled: false },
        [Validators.required],
      ],
      id_type_account: [
        { value: this.data.id_type_account, disabled: false },
        [Validators.required],
      ],
      name_account: [
        { value: this.data.name_account, disabled: false },
        [Validators.required],
      ],
    });
    this.selected = this.data.id_type_account.toString();
  }
  public GetTypesAccounts() {
    this.typeAccountService.getAllTypeAcount().subscribe((data) => {
      this.typesAccount = data;
    });
  }
  public CloseModal(isCorrect: boolean) {
    if (isCorrect) {
      if (this.formUpdateAccount.valid) {
        this.dialogRef.close(this.formUpdateAccount.value);
      } else {
        this.openSnackBar("Campos son obligatorios", "Continuar");
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
