import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

interface NSA {
  i: number;
  semilla: number;
  yi: number; 
  xi: number;
  ri: number;
  observacion: string;
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  orderForm: FormGroup;
  numeros: NSA[] = [];
  NUM_ITERATIONS = 0;
  bestSolution: [number, number] | null = null;
  Z = Infinity; 
  iterationBestSolution: number | null = null;  

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      numIteraciones: ['']
    });
  }

  ngOnInit() {}

  clearForm() {
    this.orderForm.reset();
    this.numeros = [];
  }
  generate_rx(): number {
    return Math.random();
  }

  Simulation(): void {
    for (let i = 0; i < this.NUM_ITERATIONS; i++) {
      let rx1c = this.generate_rx();
      let rx2c = this.generate_rx();
      let xc1 = Math.round(1000 * rx1c); // Genera aleatorio entre 0 y 1000
    let xc2 = Math.round(5 + 95 * rx2c); // Genera  aleatorio entre 5 y 100
      //let xc1 = 22; // Genera aleatorio entre 0 y 1000
      //let xc2 = 23;
      let x1 = xc1;
      let x2 = xc2;

      let restriction = (6 * x1 + 3 * x2 >= 200) && (3 * x1 + 5 * x2 >= 180);

      if (restriction) {
          let Zc = Math.floor(2.5 * x1 + 2 * x2);  
          if (Zc < this.Z) {
              this.Z = Zc;
              this.bestSolution = [x1, x2];
              this.iterationBestSolution = i;
          }
      }
    }
  }
  submitForm() {
    const formValue = this.orderForm.value;
    const numIteraciones = formValue.numIteraciones;

    if (!Number.isInteger(numIteraciones)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa un número entero para las iteraciones.',
        icon: 'error'
      });
      return;
    }

    if (numIteraciones <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Solo se permite números positivos > 0.',
        icon: 'error'
      });
      return;
    }
    this.NUM_ITERATIONS = numIteraciones;  // Actualizamos la cantidad de iteraciones
    this.Simulation();
    Swal.fire({
      title: 'Simulacion generada con éxito',
      text: 'Se ha generado la simulación con éxito.',
      icon: 'success'
    });
  }
}
