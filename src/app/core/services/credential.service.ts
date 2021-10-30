import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CredentialService {
  private BASE_URL = "http://localhost:4000/";

  constructor(private http: HttpClient) {}

  createCredential(credential): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-credentials`, credential);
  }
}
