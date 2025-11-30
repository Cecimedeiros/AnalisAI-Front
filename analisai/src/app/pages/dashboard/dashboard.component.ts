import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importação necessária para redirecionar
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
  // Injeção de dependências
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  // Variável que armazena o token vindo do Login
  jiraToken = ''; 

  // Dados da tela
  stats: DashboardStats | null = null;
  tasks: JiraTask[] = [];
  
  // Controle da Interface
  loading = false;
  analyzing = false;
  showAnalysis = false;
  selectedTask: JiraTask | null = null;
  aiAnalysisResult: any = null;

  // Chat (Mock visual por enquanto)
  userInput = '';
  messages: any[] = [
    { sender: 'ai', text: 'Olá 👋! Sou a AnalisAI. Estou analisando seus dados do Jira.' }
  ];

  ngOnInit() {
    // 1. Tenta recuperar o token salvo no navegador
    this.jiraToken = localStorage.getItem('jiraToken') || '';

    // 2. Verifica se o token existe
    if (!this.jiraToken) {
      // Se não tiver token, expulsa para o login
      console.warn('Sem token encontrado. Redirecionando para login...');
      this.router.navigate(['/login']);
    } else {
      // Se tiver token, carrega os dados
      this.carregarDados();
    }
  }

  carregarDados() {
    this.loading = true;
    
    // Chamada 1: Estatísticas (KPIs)
    this.dashboardService.getStats(this.jiraToken).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
        if (err.status === 401 || err.status === 403) {
          this.logout(); // Se o token for inválido, faz logout
        }
      }
    });

    // Chamada 2: Lista de Tarefas
    this.dashboardService.getTasks(this.jiraToken).subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
        this.messages.push({ sender: 'ai', text: `Concluído! Encontrei ${data.length} tarefas no seu projeto.` });
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.loading = false;
        this.messages.push({ sender: 'ai', text: 'Erro de conexão com o servidor (Porta 8081).' });
      }
    });
  }

  openAnalysis(task: JiraTask) {
    this.selectedTask = task;
    this.showAnalysis = true;
    this.analyzing = true;
    this.aiAnalysisResult = null; // Limpa resultado anterior

    // Chama o backend para usar o Gemini AI
    this.dashboardService.analisarTarefa(task).subscribe({
      next: (resultado) => {
        this.aiAnalysisResult = resultado;
        this.analyzing = false;
      },
      error: (err) => {
        console.error(err);
        this.analyzing = false;
        alert('Não foi possível gerar a análise da IA no momento.');
      }
    });
  }

  closeAnalysis() {
    this.showAnalysis = false;
    this.selectedTask = null;
  }

  // Função auxiliar para formatar porcentagem no HTML
  getPercentual() {
    return this.stats ? this.stats.progressPercentage.toFixed(0) : '0';
  }
  // Adicione este método na classe DashboardComponent
  sendMessage() {
    // 1. Valida se tem texto
    const text = this.userInput.trim();
    if (!text) return;

    // 2. Adiciona a mensagem do usuário na tela imediatamente
    this.messages.push({ sender: 'user', text: text });
    this.userInput = ''; // Limpa o campo

    // 3. Adiciona um "Digitando..." falso para dar feedback
    this.messages.push({ sender: 'ai', text: 'Thinking...', loading: true });

    // 4. Envia para o Backend Java
    this.dashboardService.sendMessage(text).subscribe({
      next: (response) => {
        // Remove a mensagem de "Thinking..."
        this.messages.pop(); 
        
        // Adiciona a resposta real da IA
        this.messages.push({ sender: 'ai', text: response.reply });
        
        // (Opcional) Faz o scroll descer automaticamente se tiver muitas mensagens
      },
      error: (err) => {
        console.error('Erro no chat:', err);
        this.messages.pop(); // Remove o loading
        this.messages.push({ sender: 'ai', text: '❌ Erro ao conectar com a IA.' });
      }
    });
  }

  // Função para sair do sistema
  logout() {
    localStorage.removeItem('jiraToken');
    localStorage.removeItem('jiraEmail');
    this.router.navigate(['/login']);
  }
}