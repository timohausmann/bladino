import { useState } from 'react';
import { CreatePost } from './CreatePost';

/**
 * CreatePostToggle - Controls the visibility of CreatePost component
 */
export function CreatePostToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <CreatePost open={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}
