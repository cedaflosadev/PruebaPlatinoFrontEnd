import { Component } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
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
  }

  /*
   * Método público general para la validación de cédula ecuatoriana en base al dígito verificador.
   */

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
}
