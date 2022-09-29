import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewRecipeComponentComponent } from './dialog-new-recipe-component.component';

describe('DialogNewRecipeComponentComponent', () => {
  let component: DialogNewRecipeComponentComponent;
  let fixture: ComponentFixture<DialogNewRecipeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewRecipeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewRecipeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
