import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class HanhchinhvnService {
  private readonly dataPath = 'assets/hanhchinhvn/dist';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get(`${this.dataPath}/tinh_tp.json`);
  }

  getDistricts(provinceId: string): Observable<any> {
    return this.http.get(`${this.dataPath}/quan-huyen/${provinceId}.json`);
  }

  getWards(districtId: string): Observable<any> {
    return this.http.get(`${this.dataPath}/xa-phuong/${districtId}.json`);
  }
}

