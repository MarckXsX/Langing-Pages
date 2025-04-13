import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Hospital-Bloom';

  constructor(private primeng: PrimeNG) {

  }

  ngOnInit(){
    this.primeng.ripple.set(true)
  }


}
