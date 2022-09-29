import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeganReferenceComponent } from './vegan-reference.component';

describe('VeganReferenceComponent', () => {
  let component: VeganReferenceComponent;
  let fixture: ComponentFixture<VeganReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeganReferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VeganReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
