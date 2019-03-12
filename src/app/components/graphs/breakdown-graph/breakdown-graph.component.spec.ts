import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownGraphComponent } from './breakdown-graph.component';

describe('BreakdownGraphComponent', () => {
  let component: BreakdownGraphComponent;
  let fixture: ComponentFixture<BreakdownGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakdownGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
