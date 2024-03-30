import { Component } from '@angular/core';
import { FootballService } from './services/football.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, mergeMap, tap } from 'rxjs/operators';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  competitions = [];
  matchDays: number[] = [];
  matches;
  matchesToDisplay = [];
  searchForm!: FormGroup;
  selectedCompetition = '';
  selectedMatchday = '';
  dates: string[] = [];
  dateBasedGroupedMatches = {};

  constructor(private service: FootballService, private fb: FormBuilder, public loaderService: LoaderService) {
    this.searchForm = this.fb.group({
      competition: [null, Validators.required],
      matchDay: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getCompetitions();
  }


  getCompetitions() {
    this.service.getCompetitions().subscribe((data: any) => {
      this.competitions = data.competitions;
    })
  }

  getCompetitionMatches() {
    this.matchDays = [];
    this.searchForm.controls['matchDay'].setValue(null);
    this.service.getCompetitionMatches(this.searchForm.controls['competition'].value)
      .pipe(
        map(response => response['matches'])
      ).subscribe((data: any) => {
        this.matches = data;
        this.matchDays = (([...new Set(data.map(match => match.matchday).filter(matchday => matchday !== null))]) as number[]).sort((a, b) => a - b)
      });
  }

  search() {
    this.selectedCompetition = this.competitions.filter(c => c['id'] == this.searchForm.controls['competition'].value)[0]['name'];
    this.selectedMatchday = this.searchForm.controls['matchDay'].value;
    this.matchesToDisplay = this.matches.filter(m => m['matchday'] == this.selectedMatchday).sort((a, b) => new Date(a['utcDate']).getTime() - new Date(b['utcDate']).getTime())
    this.groupMatchesByDate();
  }

  competitionSelected() {
    this.getCompetitionMatches();
  }

  groupMatchesByDate() {
    this.dates = [];
    this.dateBasedGroupedMatches = {};
    this.matchesToDisplay.forEach(match => {
      const matchDate = new Date(match['utcDate']).toLocaleDateString();
      if (!this.dateBasedGroupedMatches[matchDate]) {
        this.dateBasedGroupedMatches[matchDate] = [];
      }
      this.dateBasedGroupedMatches[matchDate].push(match);
    });
    this.dateBasedGroupedMatches = Object.fromEntries(Object.entries(this.dateBasedGroupedMatches).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()));
    this.dates = Object.keys(this.dateBasedGroupedMatches);
  }
}
