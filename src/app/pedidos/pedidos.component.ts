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
  degenerationIteration: number | string = 'N/A';
  sequencePeriod: number | string = 'N/A';  

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      semilla: [''],
      limite: ['']
    });
  }

  ngOnInit() {}

  clearForm() {
    this.orderForm.reset();
    this.numeros = [];
    this.degenerationIteration = 'N/A';
    this.sequencePeriod = 'N/A';
  }
  
  submitForm() {
    const formValue = this.orderForm.value;
    const semilla = formValue.semilla;
    const limite = formValue.limite;
    let currentSeed = semilla;
    let degenerationFound = false;
    let firstOccurrence: number | undefined;
    let seedsSet = new Set<number>();
    const originalSeedLength = currentSeed.toString().length;

    if (!Number.isInteger(semilla) || !Number.isInteger(limite)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa solo números enteros.',
        icon: 'error'
      });
      return;
    }

    if (!semilla && !limite) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, llena todos los campos.',
        icon: 'error'
      });
      return;
    }

    if (semilla <= 0 || limite <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Solo se permite números positivos > 0.',
        icon: 'error'
      });
      return;
    }

    if (semilla.toString().length <= 3) {
      Swal.fire({
        title: 'Error',
        text: 'La semilla debe tener más de 3 dígitos.',
        icon: 'error'
      });
      return;
    }

    for (let i = 1; i <= limite; i++) {
      let yi = currentSeed * currentSeed;
      let yiStr = yi.toString();
      let seedLengthDifference = yiStr.length - originalSeedLength;

      if (seedLengthDifference % 2 !== 0) {
          yiStr = "0" + yiStr;
          seedLengthDifference++;
      }

      let xi = parseInt(yiStr.slice(seedLengthDifference / 2, seedLengthDifference / 2 + originalSeedLength), 10);
      let ri = xi / Math.pow(10, originalSeedLength);
      let observacion = seedsSet.has(xi) ? 'Secuencia degenerada' : '';

      if (seedsSet.has(xi) && !degenerationFound) {
        this.degenerationIteration = i;
        firstOccurrence = Array.from(seedsSet).indexOf(xi) + 1;
        degenerationFound = true;
      }

      seedsSet.add(xi);

      this.numeros.push({
        i: i,
        semilla: currentSeed,
        yi: yi,
        xi: xi,
        ri: ri,
        observacion: observacion
      });

      currentSeed = xi;
    }

    if (degenerationFound && firstOccurrence !== undefined) {
      this.sequencePeriod = (this.degenerationIteration as number) - firstOccurrence;
    } else {
      this.degenerationIteration = 'N/A';
      this.sequencePeriod = 'N/A';
    }

    Swal.fire({
      title: 'Números Generados',
      text: 'Se han generado los números aleatorios con éxito.',
      icon: 'success'
    });
  }
}
