import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { HeaderButton } from '../ui/HeaderButton';
import { CreatePost } from './CreatePost';

/**
 * CreatePostToggle - Controls the visibility of CreatePost component
 */
export function CreatePostToggle() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={clsx(
            "flex flex-col transition-all duration-300 ease-in-out",
            isOpen ? 'gap-2' : 'gap-0'
        )}>
            <div className="flex justify-between items-center">
                <div className="text-foreground font-medium">
                    Post something
                </div>

                <HeaderButton
                    onClick={(e) => {
                        e?.stopPropagation();
                        setIsOpen(state => !state);
                    }}
                    icon={<ChevronDown className={clsx('transition-transform duration-300', isOpen ? '-scale-y-100' : '')} size={20} />}
                    label="Close post creation"
                />
            </div>
            <CreatePost open={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}
