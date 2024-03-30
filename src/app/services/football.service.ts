import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FootballService {
  // private url='https://api.football-data.org/v4/';
  private url = 'https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/';

  constructor(private http: HttpClient) { }

  getCompetitions() {
    return this.http.get(this.url + 'competitions');
  }

  getCompetitionMatches(competitionId) {
    return this.http.get(this.url + `competitions/${competitionId}/matches`);
  }
}
