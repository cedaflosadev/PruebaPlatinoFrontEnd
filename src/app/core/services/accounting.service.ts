import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AccountingsService {
  private BASE_URL = "http://localhost:4000";

  constructor(private http: HttpClient) {}

  getAllAcount(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-accounting-plan`);
  }

  createAccount(account: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-accounting`, account);
  }

  updateAccount(account: object): any {
    return this.http.post(`${this.BASE_URL}/update-accounting`, account);
  }

  deleteAccount(account: object): any {
    return this.http.post(`${this.BASE_URL}/delete-accounting`, account);
  }

  reactiveAccount(account: object): any {
    return this.http.post(`${this.BASE_URL}/reactive-accounting`, account);
  }
}
