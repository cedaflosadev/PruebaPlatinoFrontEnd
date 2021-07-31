import { Component, OnInit, Inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ClientsModel } from "app/core/models/client.model";
import { QuotesModel } from "app/core/models/quotes.model";
import { ClientService } from "app/core/services/client.service";

@Component({
  selector: "app-modal-attent-quote",
  templateUrl: "./modal-attent-quote.component.html",
  styles: [],
})
export class ModalAttentQuoteComponent implements OnInit {
  public formUpdateQuotes: FormGroup;
  public formUpdateQuotesErrors: QuotesModel = new QuotesModel();
  public clients = [];
  constructor(
    public dialogRef: MatDialogRef<ModalAttentQuoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuotesModel,
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.CreateForm();
  }

  public GetAllClients() {
    this.clientService.getClients().subscribe((data) => {
      this.clients = data.data;
    });
  }

  public CloseModal(isCorrect: boolean) {
    if (isCorrect) {
      if (this.formUpdateQuotes.valid) {
        this.dialogRef.close(this.formUpdateQuotes.value);
      } else {
        this.formUpdateQuotes.markAllAsTouched();
      }
    } else {
      this.dialogRef.close(isCorrect);
    }
  }

  public CreateForm() {
    this.formUpdateQuotes = this.formBuilder.group({
      description: [{ value: null, disabled: false }, [Validators.required]],
      id_quote: [
        { value: this.data._id, disabled: false },
        [Validators.required],
      ],

      id_client: [
        { value: this.data.id_client, disabled: false },
        [Validators.required],
      ],

      attention_date: [{ value: null, disabled: false }, ,],
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
