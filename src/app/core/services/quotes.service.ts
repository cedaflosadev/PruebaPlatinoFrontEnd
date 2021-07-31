import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class QuotesService {
  private BASE_URL = "http://localhost:4000/quotes";

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/list-quotes`);
  }

  createQuotes(quote: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create-quotes`, quote);
  }

  deleteQuotes(quote: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/delete-quotes`, quote);
  }
  updateQuotes(quote: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/update-quotes`, quote);
  }

  updateStateQuotes(quote: object): Observable<any> {
    return this.http.post(`${this.BASE_URL}/update-state-quotes`, quote);
  }
}
