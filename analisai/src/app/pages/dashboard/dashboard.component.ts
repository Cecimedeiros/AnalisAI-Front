import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../core/layout/sidebar/sidebar.component';
import { DashboardService, DashboardStats, JiraTask } from './dashboard.service';

@Component({
  selector: 'analisai-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  jiraToken = 'token-fake-apenas-para-ignorar-erro'; 

  // Dados da tela
  stats: DashboardStats | null = null;
  tasks: JiraTask[] = [];
  
  // Controle da Interface
  loading = false;
  analyzing = false;
  showAnalysis = false;
  selectedTask: JiraTask | null = null;
  aiAnalysisResult: any = null;

  // Chat
  userInput = '';
  messages: any[] = [
    { sender: 'ai', text: 'Olá 👋! Sou a AnalisAI. Carreguei os dados do projeto de RH com sucesso.' }
  ];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    
    // Carrega Stats (Mock)
    this.dashboardService.getStats(this.jiraToken).subscribe({
      next: (data) => { this.stats = data; }
    });

    // Carrega Tarefas (Mock)
    this.dashboardService.getTasks(this.jiraToken).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading = false;
      }
    });
  }

  // Função para tratar as classes CSS dos status
  getStatusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('pendente')) return 'tarefas-pendentes';
    if (normalized.includes('andamento')) return 'em-andamento';
    if (normalized.includes('conclu')) return 'concluido';
    return '';
  }

  openAnalysis(task: JiraTask) {
    this.selectedTask = task;
    this.showAnalysis = true;
    this.analyzing = true;
    this.aiAnalysisResult = null;

    this.dashboardService.analisarTarefa(task).subscribe({
      next: (resultado) => {
        this.aiAnalysisResult = resultado;
        this.analyzing = false;
      },
      error: (err) => {
        // Mock de resposta da IA caso o backend esteja desligado
        setTimeout(() => {
            this.aiAnalysisResult = {
                riscosIdentificados: ['Possível gargalo na etapa de aprovação', 'Documentação pendente'],
                sugestoesOtimizacao: ['Automatizar envio de e-mail', 'Validar requisitos antes de iniciar']
            };
            this.analyzing = false;
        }, 1500);
      }
    });
  }

  closeAnalysis() {
    this.showAnalysis = false;
    this.selectedTask = null;
  }

  getPercentual() {
    return this.stats ? this.stats.progressPercentage.toFixed(0) : '0';
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text: text });
    this.userInput = ''; 
    this.messages.push({ sender: 'ai', text: 'Thinking...', loading: true });

    this.dashboardService.sendMessage(text).subscribe({
      next: (response) => {
        this.messages.pop(); 
        this.messages.push({ sender: 'ai', text: response.reply });
      },
      error: (err) => {
        this.messages.pop(); 
        this.messages.push({ sender: 'ai', text: 'No momento estou operando apenas com dados locais. O cérebro da IA está desconectado.' });
      }
    });
  }
}