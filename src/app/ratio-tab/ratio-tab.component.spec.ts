import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioTabComponent } from './ratio-tab.component';

describe('RatioTabComponent', () => {
  let component: RatioTabComponent;
  let fixture: ComponentFixture<RatioTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatioTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
