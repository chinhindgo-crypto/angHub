
import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {   
   fruit = ['mango', 'banana', 'grapes'];
}


