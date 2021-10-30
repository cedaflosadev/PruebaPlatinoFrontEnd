import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TypeAccountingService {
  private BASE_URL = "http://localhost:4000/";

  constructor(private http: HttpClient) {}

  getAllTypeAcount(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-type-account`);
  }

  createTypeAccount(account:object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-type-account`,account);
  }

}
