import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private readonly messageService: MessageService) { }

  showToast(summary: string, detail: string, severity: string){
    this.messageService.add({
      summary,
      detail,
      severity,
    });
  }
}
