/** jsdom has no ResizeObserver; @dnd-kit reads it at import time to track droppable shapes. */
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver ??=
  MockResizeObserver as unknown as typeof ResizeObserver;
