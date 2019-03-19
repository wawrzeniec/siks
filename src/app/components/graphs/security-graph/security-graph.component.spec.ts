import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGraphComponent } from './security-graph.component';

describe('SecurityGraphComponent', () => {
  let component: SecurityGraphComponent;
  let fixture: ComponentFixture<SecurityGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
