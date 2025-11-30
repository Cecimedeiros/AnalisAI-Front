import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service'; // Importe o serviço criado acima

@Component({
  selector: 'analisai-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService); // Injeção do serviço
  
  form!: FormGroup;
  loading = false;
  errorMessage = ''; // Para mostrar erro na tela

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], // "Password" aqui será o Token do Jira
      remember: [false]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.form.value;

    // Chama o backend para verificar se as credenciais funcionam no Jira
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login sucesso:', response);
        // Redireciona para o Dashboard já autenticado
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('Erro login:', err);
        this.loading = false;
        this.errorMessage = 'Falha no login. Verifique seu Email e Token do Jira.';
      }
    });
  }

  goDemo() {
    // Define um token especial para identificar o modo demo
    localStorage.setItem('jiraToken', 'demo-mode');
    localStorage.setItem('jiraEmail', 'demo@analisai.com');
    
    this.router.navigateByUrl('/dashboard');
  }
}