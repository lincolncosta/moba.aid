import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_KEY = 'YOUR_API_KEY';
  API_URL = 'http://localhost:3333/result';

  constructor(private httpClient: HttpClient) { }

  generateComposition(formValue) {

    return this.httpClient.get(this.API_URL, {
      params: {
        strategy: formValue.strategy.value,
        maxFitValue: formValue.strategy.maxFitValue,
        populationSize: formValue.populationSize,
        mutationChance: formValue.mutationChance,
        maxGenerations: formValue.maxGenerations,
        bannedChampions: formValue.champions
      }
    });
  }
}
