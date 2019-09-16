import { Component, OnInit, Input } from '@angular/core';
import { Champion } from '../dto/champion.dto'
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-champion',
  templateUrl: './select-champion.component.html',
  styleUrls: ['./select-champion.component.css']
})
export class SelectChampionsComponent implements OnInit {

  @Input() parentForm: FormGroup

  champions: Champion[] = [
    { id: 1, name: 'Aatrox' },
    { id: 2, name: 'Ahri' },
    { id: 3, name: 'Akali' },
    { id: 4, name: 'Alistar' },
    { id: 5, name: 'Amumu' },
    { id: 6, name: 'Anivia' },
    { id: 7, name: 'Annie' },
  ]

  constructor() { }

  ngOnInit() {
  }

}
