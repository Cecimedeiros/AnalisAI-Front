import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

// --- DADOS FIXOS DO SEU CSV ---
const DADOS_MOCK: JiraTask[] = [
  { key: 'AP-24', issuetype: 'Epic', summary: 'EPIC-03: Avaliação de Experiência (90 dias)', assignee: 'BEATRIZ PAREDES', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-23', issuetype: 'Epic', summary: 'EPIC-02: Onboarding de Novos Colaboradores', assignee: 'BEATRIZ PAREDES', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-22', issuetype: 'Epic', summary: 'EPIC-01: Recrutamento de Talentos', assignee: 'BEATRIZ PAREDES', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-21', issuetype: 'Tarefa', summary: 'Novos colaboradores integrados por mês', assignee: 'BEATRIZ PAREDES', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-20', issuetype: 'Tarefa', summary: 'Tempo médio de contratação por vaga', assignee: 'CECÍLIA MEDEIROS', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-19', issuetype: 'Tarefa', summary: 'Vagas por status (em aberto, em andamento)', assignee: 'BEATRIZ PAREDES', status: 'Tarefas pendentes', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-13', issuetype: 'Tarefa', summary: 'Criar acesso de e-mail corporativo', assignee: 'CECÍLIA MEDEIROS', status: 'Em andamento', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-12', issuetype: 'Tarefa', summary: 'Preparar documentação de admissão', assignee: 'BEATRIZ PAREDES', status: 'Em andamento', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-11', issuetype: 'Tarefa', summary: 'Processo de Integração', assignee: 'BEATRIZ PAREDES', status: 'Em andamento', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-9', issuetype: 'Tarefa', summary: 'Ajustar formulário de inscrição online', assignee: 'ISABELLA BATISTA', status: 'Concluído', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-8', issuetype: 'Tarefa', summary: 'Agendar entrevistas', assignee: 'BEATRIZ PAREDES', status: 'Concluído', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-7', issuetype: 'Tarefa', summary: 'Triagem de currículos', assignee: 'CECÍLIA MEDEIROS', status: 'Concluído', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-6', issuetype: 'Tarefa', summary: 'Publicar vaga em sites parceiros', assignee: 'CECÍLIA MEDEIROS', status: 'Concluído', created: '24/out/25', updated: '24/out/25', duedate: '' },
  { key: 'AP-5', issuetype: 'Tarefa', summary: 'Criar requisição de vaga para Analista', assignee: 'BEATRIZ PAREDES', status: 'Concluído', created: '24/out/25', updated: '24/out/25', duedate: '' }
];

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  // Mantive a URL caso queira ligar a IA depois, mas os dados virão do Mock
  private apiUrl = 'http://localhost:8081/api';

  // Retorna os dados mocados imediatamente
  getTasks(token: string): Observable<JiraTask[]> {
    return of(DADOS_MOCK);
  }

  // Retorna stats calculados manualmente com base no seu CSV
  getStats(token: string): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalTasks: 14,
      completedTasks: 5,
      inProgressTasks: 3,
      todoTasks: 6,
      delayedTasks: 0,
      progressPercentage: 35, // (5 / 14 * 100 arredondado)
      tasksByStatus: { 'Concluído': 5, 'Em andamento': 3, 'Tarefas pendentes': 6 }
    };
    return of(stats);
  }

  analisarTarefa(tarefa: JiraTask): Observable<AnaliseResponse> {
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
    // Tenta chamar a IA real, se falhar o componente trata
    return this.http.post<AnaliseResponse>(`${this.apiUrl}/analise-ia/analisar-tarefa`, payload);
  }

  sendMessage(message: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${this.apiUrl}/analise-ia/chat`, { message });
  }
}