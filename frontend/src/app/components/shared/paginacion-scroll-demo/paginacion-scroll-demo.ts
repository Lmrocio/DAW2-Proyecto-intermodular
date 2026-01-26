import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

interface DemoItem {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Component({
  selector: 'app-paginacion-scroll-demo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './paginacion-scroll-demo.html',
  styleUrl: './paginacion-scroll-demo.scss'
})
export class PaginacionScrollDemo implements OnInit, AfterViewInit, OnDestroy {
  activeTab = signal<'paginacion' | 'infinite'>('paginacion');
  pageSize = 10;

  paginationState = signal<{ loading: boolean; data: DemoItem[]; total: number; page: number }>({
    loading: false,
    data: [],
    total: 100,
    page: 1
  });

  totalPagesPagination = computed(() => Math.ceil(this.paginationState().total / this.pageSize));

  infinitePageSize = 15;
  totalItemsInfinite = 100;

  infiniteState = signal<{ loading: boolean; data: DemoItem[]; page: number; eof: boolean }>({
    loading: false,
    data: [],
    page: 1,
    eof: false
  });

  @ViewChild('infiniteAnchor') infiniteAnchor!: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loadPaginationPage(1);
  }

  ngAfterViewInit(): void {
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.subscriptions.unsubscribe();
  }

  loadPaginationPage(page: number): void {
    if (page < 1 || page > this.totalPagesPagination()) return;

    this.paginationState.update(s => ({ ...s, loading: true, page }));

    const sub = this.getMockPaginatedData(page, this.pageSize).subscribe(response => {
      this.paginationState.set({
        loading: false,
        data: response.items,
        total: response.total,
        page: response.page
      });
    });

    this.subscriptions.add(sub);
  }

  setupInfiniteScroll(): void {
    if (!this.infiniteAnchor) return;

    this.observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          this.loadMoreInfinite();
        }
      },
      { root: null, threshold: 0.1 }
    );

    this.observer.observe(this.infiniteAnchor.nativeElement);
    this.loadMoreInfinite();
  }

  loadMoreInfinite(): void {
    const { loading, page, eof } = this.infiniteState();
    if (loading || eof) return;

    this.infiniteState.update(s => ({ ...s, loading: true }));

    const sub = this.getMockPaginatedData(page, this.infinitePageSize).subscribe(response => {
      this.infiniteState.update(s => ({
        loading: false,
        data: [...s.data, ...response.items],
        page: s.page + 1,
        eof: response.items.length === 0 || s.data.length + response.items.length >= this.totalItemsInfinite
      }));
    });

    this.subscriptions.add(sub);
  }

  resetInfinite(): void {
    this.infiniteState.set({ loading: false, data: [], page: 1, eof: false });

    if (this.observer && this.infiniteAnchor) {
      this.observer.disconnect();
      this.setupInfiniteScroll();
    }
  }

  private getMockPaginatedData(page: number, pageSize: number): Observable<PaginatedResponse<DemoItem>> {
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
    const total = page <= Math.ceil(this.totalItemsInfinite / pageSize) ? this.totalItemsInfinite : 0;
    const startId = (page - 1) * pageSize + 1;
    const endId = Math.min(startId + pageSize - 1, this.totalItemsInfinite);
    const items: DemoItem[] = [];

    for (let i = startId; i <= endId; i++) {
      items.push({
        id: i,
        name: `Producto ${i}`,
        description: `Descripción del producto número ${i}`,
        category: categories[i % categories.length]
      });
    }

    return of({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }).pipe(delay(800));
  }

  trackById(index: number, item: DemoItem): number {
    return item.id;
  }
}
