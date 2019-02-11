import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from '@app/services/session.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title: string = 'siks';
  loginOpen: boolean = false;
  
  constructor(public sessionService: SessionService) {
    
  };

  ngOnInit() {
    this.sessionService.checkSession();
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.sessionService.checkSession();
  }
}


