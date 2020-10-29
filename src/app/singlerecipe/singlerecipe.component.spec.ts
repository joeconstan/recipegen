import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglerecipeComponent } from './singlerecipe.component';

describe('SinglerecipeComponent', () => {
  let component: SinglerecipeComponent;
  let fixture: ComponentFixture<SinglerecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglerecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglerecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
