import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AttentionsService {
  private BASE_URL = "http://localhost:4000/attentions";

  constructor(private http: HttpClient) {}

  getAttentions(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/list-attentions`);
  }

  createAttentions(attention: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-attentions`, attention);
  }
}
