import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecipelistComponent } from './recipelist.component';

describe('RecipelistComponent', () => {
  let component: RecipelistComponent;
  let fixture: ComponentFixture<RecipelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
