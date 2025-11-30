import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/auth'; // Porta do seu backend Java

  constructor() {}

  /**
   * Envia as credenciais para validação no backend.
   * Se for sucesso, salva o token formatado para uso no Dashboard.
   */
  login(email: string, apiToken: string): Observable<any> {
    // O backend espera parametros (@RequestParam), não JSON body.
    const params = new HttpParams()
      .set('email', email)
      .set('apiToken', apiToken);

    return this.http.post(`${this.apiUrl}/login`, null, { params, responseType: 'text' })
      .pipe(
        tap(() => {
          // Se o login passou, geramos o token Base64 (Email:Token)
          // Esse é o formato que o Jira exige para as requisições futuras
          const tokenBase64 = btoa(`${email}:${apiToken}`);
          
          // Salva no navegador para o Dashboard usar depois
          localStorage.setItem('jiraToken', tokenBase64);
          localStorage.setItem('jiraEmail', email);
        })
      );
  }

  logout() {
    localStorage.removeItem('jiraToken');
    localStorage.removeItem('jiraEmail');
  }

  // Método auxiliar para pegar o token salvo
  getToken(): string | null {
    return localStorage.getItem('jiraToken');
  }
}