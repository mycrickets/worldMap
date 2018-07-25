import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTabComponent } from './one-tab.component';

describe('OneTabComponent', () => {
  let component: OneTabComponent;
  let fixture: ComponentFixture<OneTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
