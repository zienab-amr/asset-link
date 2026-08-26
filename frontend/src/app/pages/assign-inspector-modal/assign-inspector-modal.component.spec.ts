import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInspectorModalComponent } from './assign-inspector-modal.component';

describe('AssignInspectorModalComponent', () => {
  let component: AssignInspectorModalComponent;
  let fixture: ComponentFixture<AssignInspectorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignInspectorModalComponent]
    });
    fixture = TestBed.createComponent(AssignInspectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
