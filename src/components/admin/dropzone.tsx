'use client';

import { useCallback, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileArchive, Upload, X } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import type { MediaAsset } from '@/lib/types';

export type UploadKind = 'thumbnail' | 'gallery' | 'product-file' | 'document';

interface UploadTask {
  id: string;
  name: string;
  size: number;
  loaded: number;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

/**
 * Drag & drop upload zone with real per-file progress.
 *
 * Uses XMLHttpRequest rather than fetch because fetch still cannot report
 * upload progress — and a 350 MB .rbxl with no progress bar is a bad experience.
 */
export function Dropzone({
  kind,
  productSlug,
  productId,
  productName,
  accept,
  multiple = false,
  hint,
  onUploaded,
  className,
  compact = false,
}: {
  kind: UploadKind;
  productSlug: string;
  productId?: string;
  productName?: string;
  accept: string;
  multiple?: boolean;
  hint: string;
  onUploaded: (asset: MediaAsset) => void;
  className?: string;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    (file: File) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setTasks((current) => [
        ...current,
        { id, name: file.name, size: file.size, loaded: 0, progress: 0, status: 'uploading' },
      ]);

      const form = new FormData();
      form.append('file', file);
      form.append('kind', kind);
      form.append('productSlug', productSlug || 'unassigned');
      if (productId) form.append('productId', productId);
      if (productName) form.append('productName', productName);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      xhr.upload.addEventListener('progress', (event) => {
        if (!event.lengthComputable) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        setTasks((current) =>
          current.map((t) => (t.id === id ? { ...t, progress, loaded: event.loaded } : t)),
        );
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const { asset } = JSON.parse(xhr.responseText) as { asset: MediaAsset };
          setTasks((current) =>
            current.map((t) => (t.id === id ? { ...t, progress: 100, status: 'done' } : t)),
          );
          onUploaded(asset);
          // Clear the finished row after a beat so the zone does not fill up.
          setTimeout(() => setTasks((current) => current.filter((t) => t.id !== id)), 2500);
        } else {
          let message = 'Le téléversement a échoué';
          try {
            message = (JSON.parse(xhr.responseText) as { error?: string }).error ?? message;
          } catch {
            /* non-JSON error */
          }
          setTasks((current) =>
            current.map((t) => (t.id === id ? { ...t, status: 'error', error: message } : t)),
          );
        }
      });

      xhr.addEventListener('error', () => {
        setTasks((current) =>
          current.map((t) =>
            t.id === id ? { ...t, status: 'error', error: 'Erreur réseau' } : t,
          ),
        );
      });

      xhr.send(form);
    },
    [kind, productSlug, productId, productName, onUploaded],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = multiple ? Array.from(files) : Array.from(files).slice(0, 1);
    list.forEach(upload);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition-all duration-200',
          compact ? 'p-6' : 'p-10',
          dragging
            ? 'border-brand bg-brand/8 scale-[1.01]'
            : 'border-line-strong bg-surface/50 hover:border-brand/50 hover:bg-brand-soft',
        )}
      >
        <span
          className={cn(
            'grid place-items-center rounded-xl border border-line bg-surface-overlay transition-all duration-200',
            compact ? 'size-10' : 'size-12',
            dragging ? 'scale-110 text-brand' : 'text-ink-subtle group-hover:text-brand',
          )}
        >
          <Upload className={compact ? 'size-4' : 'size-5'} />
        </span>

        <div className="space-y-0.5">
          <p className={cn('font-medium text-ink', compact && 'text-sm')}>
            {dragging ? 'Déposez pour téléverser' : 'Glissez-déposez vos fichiers ici'}
          </p>
          <p className="text-sm text-ink-muted">ou cliquez pour parcourir</p>
        </div>

        <p className="text-xs text-ink-subtle">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>

      {/* Live progress */}
      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-line bg-surface/70 p-3">
              <div className="flex items-center gap-2.5">
                {task.status === 'done' ? (
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                ) : task.status === 'error' ? (
                  <AlertCircle className="size-4 shrink-0 text-danger" />
                ) : (
                  <FileArchive className="size-4 shrink-0 text-brand" />
                )}

                <span className="min-w-0 flex-1 truncate text-sm text-ink">{task.name}</span>

                <span className="shrink-0 text-xs tabular-nums text-ink-subtle">
                  {task.status === 'error' ? task.error : `${task.progress}%`}
                </span>

                {task.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => setTasks((c) => c.filter((t) => t.id !== task.id))}
                    aria-label="Ignorer"
                    className="cursor-pointer text-ink-subtle hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {task.status !== 'error' && (
                <>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-overlay">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        task.status === 'done' ? 'bg-success' : 'bg-brand-gradient',
                      )}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs tabular-nums text-ink-subtle">
                    {formatBytes(task.loaded)} / {formatBytes(task.size)}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
