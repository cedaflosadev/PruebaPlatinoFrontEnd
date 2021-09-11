import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimeLocalService {
  private BASE_URL = "http://localhost:4000/time";

  constructor(private http: HttpClient) {}

  getDateNow(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-date-now`);
  }
}
