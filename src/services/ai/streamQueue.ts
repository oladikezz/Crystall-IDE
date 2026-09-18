// ============================================================================
// Crystall IDE — Backpressure & Token Smoothing Queue
// ============================================================================
// Manages high-velocity token bursts from fast cloud (Groq 500 tok/s) and
// local offline models (Ollama 100 tok/s) to prevent UI thread lockup.

export interface StreamTokenQueueOptions {
  onFlush: (token: string, isThinking?: boolean) => void;
  onDone?: () => void;
  chunkBatchIntervalMs?: number; // default: 16ms (60 FPS tick)
}

interface QueuedToken {
  text: string;
  isThinking: boolean;
}

export class StreamTokenQueue {
  private queue: QueuedToken[] = [];
  private isProcessing = false;
  private isEnded = false;
  private abortSignal?: AbortSignal;
  private options: StreamTokenQueueOptions;

  constructor(options: StreamTokenQueueOptions, abortSignal?: AbortSignal) {
    this.options = {
      chunkBatchIntervalMs: 16,
      ...options
    };
    this.abortSignal = abortSignal;

    if (this.abortSignal) {
      this.abortSignal.addEventListener('abort', () => {
        this.clear();
      });
    }
  }

  /**
   * Enqueues content or thinking tokens for smoothed dispatch.
   */
  public enqueue(text: string, isThinking = false): void {
    if (this.abortSignal?.aborted || !text) return;
    this.queue.push({ text, isThinking });

    if (!this.isProcessing) {
      this.startFlushLoop();
    }
  }

  /**
   * Signals that no further incoming chunks will arrive.
   */
  public end(): void {
    this.isEnded = true;
    if (this.queue.length === 0) {
      this.options.onDone?.();
    }
  }

  /**
   * Clears any buffered tokens immediately.
   */
  public clear(): void {
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Drains the queue smoothly in batches aligned with the rendering frame rate.
   */
  private startFlushLoop(): void {
    this.isProcessing = true;

    const flushBatch = () => {
      if (this.abortSignal?.aborted) {
        this.clear();
        return;
      }

      if (this.queue.length === 0) {
        this.isProcessing = false;
        if (this.isEnded) {
          this.options.onDone?.();
        }
        return;
      }

      // Dynamic batching: if queue is backing up, consume more per frame to prevent delay
      const batchSize = this.queue.length > 50 ? 8 : this.queue.length > 20 ? 4 : 1;
      const itemsToDispatch = this.queue.splice(0, batchSize);

      // Group consecutive items of the same type (thinking vs content)
      let thinkingBatch = '';
      let contentBatch = '';

      for (const item of itemsToDispatch) {
        if (item.isThinking) {
          thinkingBatch += item.text;
        } else {
          contentBatch += item.text;
        }
      }

      if (thinkingBatch) {
        this.options.onFlush(thinkingBatch, true);
      }
      if (contentBatch) {
        this.options.onFlush(contentBatch, false);
      }

      if (this.queue.length > 0) {
        setTimeout(flushBatch, this.options.chunkBatchIntervalMs);
      } else {
        this.isProcessing = false;
        if (this.isEnded) {
          this.options.onDone?.();
        }
      }
    };

    setTimeout(flushBatch, 0);
  }
}
