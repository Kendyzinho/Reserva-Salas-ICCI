import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSalasComponent } from './gestion-salas.component';

describe('GestionSalasComponent', () => {
  let component: GestionSalasComponent;
  let fixture: ComponentFixture<GestionSalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSalasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
