import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaNEPage } from './pagina-ne.page';

describe('PaginaNEPage', () => {
  let component: PaginaNEPage;
  let fixture: ComponentFixture<PaginaNEPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNEPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
