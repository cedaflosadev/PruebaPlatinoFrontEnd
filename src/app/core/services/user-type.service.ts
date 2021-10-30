import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserTypeService {
  private BASE_URL = "http://localhost:4000/";

  constructor(private http: HttpClient) {}

  getAllTypeUser(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-user-type`);
  }
}
