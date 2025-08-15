import { useState } from 'react';
import { CreatePost } from './CreatePost';

/**
 * CreatePostToggle - Controls the visibility of CreatePost component
 */
export function CreatePostToggle() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <CreatePost open={isOpen} onClose={handleClose} setIsOpen={setIsOpen} />
        </div>
    );
}
