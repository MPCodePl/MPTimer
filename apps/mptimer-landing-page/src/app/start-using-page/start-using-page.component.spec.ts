import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartUsingPageComponent } from './start-using-page.component';

describe('StartUsingPageComponent', () => {
  let component: StartUsingPageComponent;
  let fixture: ComponentFixture<StartUsingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartUsingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartUsingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
