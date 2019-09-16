import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Strategy } from './../dto/strategy.dto'

@Component({
  selector: 'app-select-strategy',
  templateUrl: './select-strategy.component.html',
  styleUrls: ['./select-strategy.component.scss']
})
export class SelectStrategyComponent implements OnInit {

  @Input() parentForm: FormGroup

  strategies: Strategy[] = [
    { value: 'hardengage', viewValue: 'Hard Engage', maxFitValue: 2095 },
    { value: 'poke', viewValue: 'Poke', maxFitValue: 3356 },
    { value: 'teamfight', viewValue: 'Team Fight', maxFitValue: 3633 }
  ];

  strategy = new Strategy();

  constructor() { }

  ngOnInit() {
  }

}
