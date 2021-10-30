import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatesGlobalService {
  private BASE_URL = "http://localhost:4000/";

  constructor(private http: HttpClient) {}

  getAllStatesGlobal(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-states-global`);
  }
}
