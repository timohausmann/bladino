import { Camera } from 'lucide-react';

/**
 * CreateImage component - handles image input for posts
 */
export function CreateImage() {
  return (
    <div className="flex min-h-[120px] w-full items-center justify-center rounded-lg bg-black/10 p-4 dark:bg-black/20">
      <div className="text-center">
        <Camera className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground">Tap to add media or files</p>
      </div>
    </div>
  );
}
