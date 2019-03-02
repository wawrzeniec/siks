import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryGraphComponent } from './history-graph.component';

describe('HistoryGraphComponent', () => {
  let component: HistoryGraphComponent;
  let fixture: ComponentFixture<HistoryGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
