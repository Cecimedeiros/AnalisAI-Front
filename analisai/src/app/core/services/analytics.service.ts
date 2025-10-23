import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Kpis {
  prazoTotal: string;
  prazoOtim: string;
  produtividade: string;
  riscoMedio: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getKpis(): Observable<Kpis> {
    return of({
      prazoTotal: '45 dias',
      prazoOtim: '37 dias',
      produtividade: '+12%',
      riscoMedio: '45%'
    });
  }
}
