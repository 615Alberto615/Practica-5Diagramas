import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

interface GameResult {
  launch: number;
  result: string;
  gainLoss: number;
  totalAccumulated: number;
}

@Component({
  selector: 'app-algmul',
  templateUrl: './algmul.component.html',
  styleUrls: ['./algmul.component.css']
})
export class AlgmulComponent implements OnInit {
  orderForm: FormGroup;
  NUM_ITERATIONS = 0;
  gameResults: GameResult[] = [];
  totalAccumulated: number = 0;
 
  private throwCoins(): string[] {
    const outcomes = ['Cara', 'Sello'];
    return Array(3).fill(null).map(() => outcomes[Math.floor(Math.random() * 2)]);
  }
  private simulateGame() {
    this.gameResults = [];
    this.totalAccumulated = 0;

    for (let i = 0; i < this.NUM_ITERATIONS; i++) {
      const coins = this.throwCoins();
      const allSame = coins.every(coin => coin === coins[0]);
      const gainLoss = allSame ? 5 : -3;
      this.totalAccumulated += gainLoss;

      this.gameResults.push({
        launch: i + 1,
        result: coins.join(', '),
        gainLoss,
        totalAccumulated: this.totalAccumulated
      });
    }
  }
  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      numIteraciones: ['']
    });
  }

  ngOnInit() {}

  clearForm() {
    this.orderForm.reset();
    this.NUM_ITERATIONS = 0;
    this.gameResults = [];
    this.totalAccumulated = 0;
    

  }
  generate_rx(): number {
    return Math.random();
  }

  get winLossMessage(): string {
    if (this.totalAccumulated === 0) {
      return 'No hubo ganancia ni pérdida.';
    }
    return this.totalAccumulated > 0 ?
      `¡Felicidades! Has ganado un total de ${this.totalAccumulated} Bs.` :
      `Lo sentimos, has perdido un total de ${Math.abs(this.totalAccumulated)} Bs.`;
  }

  
  submitForm() {
    const formValue = this.orderForm.value;
    const numIteraciones = formValue.numIteraciones;

    if (!Number.isInteger(numIteraciones) || numIteraciones <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un número entero positivo para las iteraciones.',
        icon: 'error'
      });
      return;
    }

    this.NUM_ITERATIONS = numIteraciones;
    this.simulateGame();  // Llama al método que simula el juego

    Swal.fire({
      title: 'Simulación generada con éxito',
      text: 'Se ha generado la simulación con éxito.',
      icon: 'success'
    });
    
  }
}

