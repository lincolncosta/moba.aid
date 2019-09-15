import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class Strategy {
  value: string;
  viewValue: string;
  maxFitValue: number;
}

@Component({
  selector: 'app-select-strategy',
  templateUrl: './select-strategy.component.html',
  styleUrls: ['./select-strategy.component.scss']
})
export class SelectStrategyComponent implements OnInit {

  @Input() parentForm: FormGroup

  strategies: Strategy[] = [
    {value: 'hardengage', viewValue: 'Hard Engage', maxFitValue: 3633},
    {value: 'poke', viewValue: 'Poke', maxFitValue: 1},
    {value: 'teamfight', viewValue: 'Team Fight', maxFitValue: 1}
  ];

  strategy = new Strategy();

  constructor() { }

  ngOnInit() {
  }

}
