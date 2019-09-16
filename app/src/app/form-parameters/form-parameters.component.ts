import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-form-parameters',
  templateUrl: './form-parameters.component.html',
  styleUrls: ['./form-parameters.component.scss']
})
export class FormParametersComponent implements OnInit {

  parametersForm: FormGroup;

  // parametersForm = new FormGroup({
  //   strategy: new FormControl(''),
  //   populationSize: new FormControl(''),
  //   mutationChance: new FormControl(''),
  //   maxGenerations: new FormControl(''),
  // })

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.parametersForm = this.formBuilder.group({
      strategy: ['', Validators.required],
      populationSize: ['', Validators.required],
      mutationChance: ['', Validators.required],
      maxGenerations: ['', Validators.required],
      champions: ['']
    })
  }

  generateComposition() {

    if( !this.parametersForm.valid ){
      return;
    }

    console.log(this.parametersForm);
    console.log(this.parametersForm.value);

    this.apiService.generateComposition(this.parametersForm.value).subscribe(data => {
      console.log(data);
    })
  }

}
