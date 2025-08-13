import { Camera } from 'react-feather';

/**
 * CreateImage component - handles image input for posts
 */
export function CreateImage() {
    return (
        <div className="w-full min-h-[120px] p-4 flex items-center justify-center bg-black/5 dark:bg-black/10 rounded-lg">
            <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Tap to add media or files</p>
            </div>
        </div>
    );
}
