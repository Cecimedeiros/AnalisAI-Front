import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Tipos de dados iguais aos do seu Java
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  delayedTasks: number;
  progressPercentage: number;
  tasksByStatus: { [key: string]: number };
}

export interface JiraTask {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  issuetype: string;
  created: string;
  updated: string;
  duedate: string;
}

export interface AnaliseResponse {
  riscosIdentificados: string[];
  dependenciasObrigatorias: string[];
  sugestoesOtimizacao: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  
  // Aponta para a porta onde o Java está rodando (8081)
  private apiUrl = 'http://localhost:8081/api';

  // Busca estatísticas gerais
  getStats(token: string): Observable<DashboardStats> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers });
  }

  // Busca lista de tarefas
  getTasks(token: string): Observable<JiraTask[]> {
    const headers = new HttpHeaders({ 'Authorization': `Basic ${token}` });
    return this.http.get<JiraTask[]>(`${this.apiUrl}/jira/issues`, { headers });
  }

  // Envia tarefa para IA analisar
  analisarTarefa(tarefa: JiraTask): Observable<AnaliseResponse> {
    // Monta o objeto exatamente como o AnaliseTarefaRequest.java espera
    const payload = {
      key: tarefa.key,
      summary: tarefa.summary,
      status: tarefa.status,
      assignee: tarefa.assignee,
      issuetype: tarefa.issuetype,
      created: tarefa.created,
      updated: tarefa.updated,
      tarefasRelacionadas: [] 
    };
    return this.http.post<AnaliseResponse>(`${this.apiUrl}/analise-ia/analisar-tarefa`, payload);
  }
  // Em dashboard.service.ts
sendMessage(message: string): Observable<{ reply: string }> {
  return this.http.post<{ reply: string }>(`${this.apiUrl}/analise-ia/chat`, { message });
}
}