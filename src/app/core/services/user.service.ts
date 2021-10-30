import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private BASE_URL = "http://localhost:4000/";

  constructor(private http: HttpClient) {}

  createUser(user: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-user`, user);
  }
  getAllUser(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-all-user`);
  }
}
