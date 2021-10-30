import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PopStateEvent,
} from "@angular/common";
import "rxjs/add/operator/filter";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import PerfectScrollbar from "perfect-scrollbar";
import * as $ from "jquery";
import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(public location: Location, private router: Router) {}

  ngOnInit() {
    const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;

    if (
      isWindows &&
      !document
        .getElementsByTagName("body")[0]
        .classList.contains("sidebar-mini")
    ) {
      // if we are on windows OS we activate the perfectScrollbar function

      document
        .getElementsByTagName("body")[0]
        .classList.add("perfect-scrollbar-on");
    } else {
      document
        .getElementsByTagName("body")[0]
        .classList.remove("perfect-scrollbar-off");
    }
    const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
    const elemSidebar = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });
    this._router = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
    }

    const window_width = $(window).width();
    let $sidebar = $(".sidebar");
    let $sidebar_responsive = $("body > .navbar-collapse");
    let $sidebar_img_container = $sidebar.find(".sidebar-background");

    if (window_width > 767) {
      if ($(".fixed-plugin .dropdown").hasClass("show-dropdown")) {
        $(".fixed-plugin .dropdown").addClass("open");
      }
    }

    $(".fixed-plugin a").click(function (event) {
      // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
      if ($(this).hasClass("switch-trigger")) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (window.event) {
          window.event.cancelBubble = true;
        }
      }
    });

    $(".fixed-plugin .badge").click(function () {
      let $full_page_background = $(".full-page-background");

      $(this).siblings().removeClass("active");
      $(this).addClass("active");

      var new_color = $(this).data("color");

      if ($sidebar.length !== 0) {
        $sidebar.attr("data-color", new_color);
      }

      if ($sidebar_responsive.length != 0) {
        $sidebar_responsive.attr("data-color", new_color);
      }
    });

    $(".fixed-plugin .img-holder").click(function () {
      let $full_page_background = $(".full-page-background");

      $(this).parent("li").siblings().removeClass("active");
      $(this).parent("li").addClass("active");

      var new_image = $(this).find("img").attr("src");

      if ($sidebar_img_container.length != 0) {
        $sidebar_img_container.fadeOut("fast", function () {
          $sidebar_img_container.css(
            "background-image",
            'url("' + new_image + '")'
          );
          $sidebar_img_container.fadeIn("fast");
        });
      }

      if ($full_page_background.length != 0) {
        $full_page_background.fadeOut("fast", function () {
          $full_page_background.css(
            "background-image",
            'url("' + new_image + '")'
          );
          $full_page_background.fadeIn("fast");
        });
      }

      if ($sidebar_responsive.length != 0) {
        $sidebar_responsive.css("background-image", 'url("' + new_image + '")');
      }
    });
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  isMaps(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    } else {
      return true;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
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

  /*
   *
  Método público que muestra los errores del formulario inicial, recibe 3 parámetros que son los siguientes:
    * Formulario.
    * formControlName del Input.
    * Objeto que almacena mensaje de error temporal, nomenclatura debe ser igual al formControlName del Campo.
   */

  public GroupFormGeneralisControlHasError(
    formGeneral: FormGroup,
    controlName: string,
    errorsArrayGeneral: any,
    arrayForm?: boolean,
    nameArray?: string,
    index?: number
  ): boolean {
    const control = arrayForm
      ? formGeneral.get(nameArray)["controls"][index]["controls"][controlName]
      : formGeneral.controls[controlName];

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
        : control.errors.ValidNameAccount
        ? "* Cuenta es obligatoria"
        : control.errors.email
        ? "* Correo no válido"
        : control.errors.pattern
        ? "* Formato no permitido"
        : null;

      errorsArrayGeneral[controlName] = messageError;

      return result;
    }

    return false;
  }
}
