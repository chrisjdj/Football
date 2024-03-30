import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent {
  @Input() dates: string[] = [];
  @Input() dateBasedGroupedMatches = {};
  @Input() selectedCompetition = '';
  @Input() selectedMatchday = '';
}
