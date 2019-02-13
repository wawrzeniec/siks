import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssetIdComponent } from './select-asset-id.component';

describe('SelectAssetIdComponent', () => {
  let component: SelectAssetIdComponent;
  let fixture: ComponentFixture<SelectAssetIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAssetIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAssetIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
