import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email: string, password: string): Observable<boolean> {
    // Simulado: substitua pela chamada real ao backend
    return of(!!email && !!password).pipe(delay(500));
  }
}
