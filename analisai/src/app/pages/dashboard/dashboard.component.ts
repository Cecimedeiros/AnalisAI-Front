import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../core/layout/sidebar/sidebar.component';

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
}

@Component({
  selector: 'analisai-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // =============================
  // 🔹 Dados simulados iniciais
  // =============================
  userInput = '';
  messages = [
    { sender: 'ai', text: 'Olá 👋! Sou a AnalisAI. Posso te ajudar a analisar o backlog e otimizar o projeto.' }
  ];

  optimizedDeadline = '15/11/2025';
  projectDeadline = '20/11/2025';
  recalculating = false;

  showAnalysis = false;
  selectedTask: Task | null = null;

  tasks: Task[] = [
    { id: 1, title: 'Integração com API do Jira', assignee: 'Ana Silva', status: 'In Progress', dueDate: '10/11/2025' },
    { id: 2, title: 'Criação de dashboard Angular', assignee: 'Carlos Souza', status: 'To Do', dueDate: '12/11/2025' },
    { id: 3, title: 'Configurar MariaDB e persistência', assignee: 'João Lima', status: 'Done', dueDate: '05/11/2025' },
    { id: 4, title: 'Ajustar prompt LLM para análise de backlog', assignee: 'Marina Costa', status: 'In Progress', dueDate: '14/11/2025' }
  ];


  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });
    this.userInput = '';

    setTimeout(() => {
      this.messages.push({
        sender: 'ai',
        text: 'Analisando... parece que há dependências que impactam o prazo otimizado 🚀'
      });
    }, 800);
  }


  openAnalysis(task: Task) {
    this.selectedTask = task;
    this.showAnalysis = true;
  }

  closeAnalysis() {
    this.showAnalysis = false;
    this.selectedTask = null;
  }

  applySuggestion() {
    this.recalculating = true;
    setTimeout(() => {
      this.optimizedDeadline = '13/11/2025';
      this.recalculating = false;
      alert('✅ Sugestão aplicada! Prazo otimizado recalculado automaticamente.');
      this.closeAnalysis();
    }, 1000);
  }

  simulateProgressChange() {
    this.recalculating = true;
    setTimeout(() => {
      this.optimizedDeadline = '14/11/2025';
      this.recalculating = false;
    }, 1000);
  }
}
