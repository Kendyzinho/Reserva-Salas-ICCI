import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSalaComponent } from './gestionar-sala.component';

describe('GestionarSalaComponent', () => {
  let component: GestionarSalaComponent;
  let fixture: ComponentFixture<GestionarSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarSalaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
