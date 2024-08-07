import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackofficeAppSidebarDumbComponent } from './backoffice-app-sidebar-dumb.component';

describe('BackofficeAppSidebarDumbComponent', () => {
  let component: BackofficeAppSidebarDumbComponent;
  let fixture: ComponentFixture<BackofficeAppSidebarDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackofficeAppSidebarDumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackofficeAppSidebarDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
