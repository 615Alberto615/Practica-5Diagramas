import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

interface NSA {
  i: number;
  semilla: number;
  semilla1: number;
  yi: number; 
  xi: number;
  ri: number;
  observacion: string;
}

@Component({
  selector: 'app-prodmed',
  templateUrl: './prodmed.component.html',
  styleUrls: ['./prodmed.component.css']
})
export class ProdmedComponent implements OnInit {
  orderForm: FormGroup;
  numeros: NSA[] = [];
  degenerationIteration: number | string = 'N/A';
  sequencePeriod: number | string = 'N/A';

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      semilla: [''],
      semilla1: [''],
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
    const semilla1 = formValue.semilla1;
    const limite = formValue.limite;
    let currentSeed1 = semilla;
    let currentSeed2 = semilla1;
    let seedsSet = new Set();
   
    const originalSeedLength = currentSeed1.toString().length;

    let degenerationFound = false;
    let firstOccurrence: number | undefined;
    if (!Number.isInteger(semilla) || !Number.isInteger(semilla1) || !Number.isInteger(limite)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, ingresa solo números enteros.',
        icon: 'error'
      });
      return; // Salir del método
    }

    if (!semilla && !limite && !semilla1) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, llena todos los campos.',
        icon: 'error'
      });
      return; // Salir del método
    }

    // Validación: números positivos
    if (semilla <= 0 || limite <= 0 || semilla1 <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Solo se permite números positivos > 0.',
        icon: 'error'
      });
      return; // Salir del método
    }

    // Validación: semilla con > 3 dígitos
    if (semilla.toString().length <= 2 || semilla1.toString().length <= 2) {
      Swal.fire({
        title: 'Error',
        text: 'La semilla debe tener más de 2 dígitos.',
        icon: 'error'
      });
      return; // Salir del método
    }

    for (let i = 1; i <= limite; i++) {
      let yi = currentSeed1 * currentSeed2;
      let yiStr = yi.toString();
      let seedLengthDifference = yiStr.length - originalSeedLength;

      if (seedLengthDifference % 2 !== 0) {
          yiStr = "0" + yiStr;
          seedLengthDifference++;
      }

      let xi = parseInt(yiStr.slice(seedLengthDifference / 2, seedLengthDifference / 2 + originalSeedLength), 10);
      let ri = xi / Math.pow(10, originalSeedLength);
      let observacion = seedsSet.has(xi) ? 'Secuencia degenerada' : '';

      if (seedsSet.has(xi) && !this.degenerationIteration) {
          this.degenerationIteration = i;
          this.sequencePeriod = i - Array.from(seedsSet).indexOf(xi);
      }
      if (seedsSet.has(xi) && !degenerationFound) {
        this.degenerationIteration = i;
        firstOccurrence = Array.from(seedsSet).indexOf(xi) + 1;
        degenerationFound = true;
      }

      seedsSet.add(xi);

      this.numeros.push({
        i: i,
        semilla: currentSeed1,
        semilla1: currentSeed2,
        yi: yi,
        xi: xi,
        ri: ri,
        observacion: observacion
      });

      currentSeed1 = currentSeed2;
      currentSeed2 = xi;
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
