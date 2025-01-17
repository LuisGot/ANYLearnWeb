import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  HostListener,
  signal,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../shared/course.service';
import { SearchService } from '../shared/search.service';
import { CrossIconComponent } from '../../../public/icons/cross/cross-icon.component';
import { SearchIconComponent } from '../../../public/icons/search/search-icon.component';
import { NotesIconComponent } from '../../../public/icons/notes/notes-icon.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CrossIconComponent,
    SearchIconComponent,
    NotesIconComponent,
  ],
  templateUrl: './search.component.html',
  host: {
    class: 'contents',
    '[class.pointer-events-none]': 'isClosing()',
  },
})
export class SearchComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  courseService = inject(CourseService);
  searchService = inject(SearchService);

  isClosing = signal(false);
  selectedIndex = signal(-1);

  constructor() {
    effect(() => {
      const isVisible = this.searchService.isVisible();
      const filteredCourses = this.searchService.filteredCourses();

      if (isVisible || filteredCourses.length > 0) {
        this.selectedIndex.set(-1);
      }
    });
  }

  ngOnInit() {
    this.searchService.closeWithAnimation = () => this.closeWithAnimation();
  }

  ngOnDestroy() {
    if (this.searchService.closeWithAnimation === this.closeWithAnimation) {
      this.searchService.closeWithAnimation = undefined;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    this.closeWithAnimation();
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    if (this.searchService.filteredCourses().length > 0) {
      this.selectedIndex.set(
        (this.selectedIndex() + 1) % this.searchService.filteredCourses().length
      );
    }
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    if (this.searchService.filteredCourses().length > 0) {
      this.selectedIndex.set(
        (this.selectedIndex() -
          1 +
          this.searchService.filteredCourses().length) %
          this.searchService.filteredCourses().length
      );
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    if (
      this.selectedIndex() >= 0 &&
      this.selectedIndex() < this.searchService.filteredCourses().length
    ) {
      this.searchService.selectCourse(this.selectedIndex());
    }
  }

  closeWithAnimation() {
    if (this.isClosing()) return;

    this.isClosing.set(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.searchService.close();
        this.isClosing.set(false);
        this.selectedIndex.set(-1);
      }, 150);
    });
  }

  ngAfterViewInit() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  isSelected(index: number): boolean {
    return this.selectedIndex() === index;
  }
}
