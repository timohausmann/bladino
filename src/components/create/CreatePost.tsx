import clsx from 'clsx';
import { Image, Link, Type, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../form';
import { Card } from '../ui/Card';
import { HeaderButton } from '../ui/HeaderButton';
import { CreateImage } from './CreateImage';
import { CreateLink } from './CreateLink';
import { CreateText } from './CreateText';

type PostType = 'text' | 'image' | 'link';

interface CreatePostProps {
    open: boolean;
    setIsOpen: (open: boolean) => void;
}

/**
 * CreatePost component - integrated into Home page for creating new posts
 */
export function CreatePost({ open, setIsOpen }: CreatePostProps) {
    const [postType, setPostType] = useState<PostType>('text');
    const [content, setContent] = useState('');

    const handlePostTypeChange = (type: PostType) => {
        setPostType(type);
        setContent(''); // Clear content when switching types
        setIsOpen(true); // Open the form when a post type is selected
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating post:', { type: postType, content });
        // TODO: Implement post creation logic
        setContent(''); // Clear content after submission
    };

    const renderContentInput = () => {
        switch (postType) {
            case 'text':
                return (
                    <CreateText
                        content={content}
                        onContentChange={setContent}
                        maxLength={280}
                    />
                );
            case 'image':
                return <CreateImage />;
            case 'link':
                return (
                    <CreateLink
                        content={content}
                        onContentChange={setContent}
                        maxLength={280}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={clsx(
            "flex flex-col transition-all duration-300 ease-in-out",
            open ? 'gap-4' : 'gap-0'
        )}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="text-foreground font-medium">
                        Post something:
                    </div>

                    <div className="flex gap-2">
                        <HeaderButton
                            onClick={() => handlePostTypeChange('text')}
                            icon={<Type size={20} />}
                            label="Text Post"
                            variant="persistent"
                            active={open && postType === 'text'}
                        />
                        <HeaderButton
                            onClick={() => handlePostTypeChange('image')}
                            icon={<Image size={20} />}
                            label="Image Post"
                            variant="persistent"
                            active={open && postType === 'image'}
                        />
                        <HeaderButton
                            onClick={() => handlePostTypeChange('link')}
                            icon={<Link size={20} />}
                            label="Link Post"
                            variant="persistent"
                            active={open && postType === 'link'}
                        />
                    </div>
                </div>

                {/* Close button - only visible when open */}
                {open && (
                    <HeaderButton
                        onClick={(e) => {
                            e?.stopPropagation();
                            setIsOpen(false);
                        }}
                        icon={<X size={20} />}
                        label="Close post creation"
                    />
                )}
            </div>

            <Card className={clsx(
                'transition-all duration-300 ease-in-out overflow-hidden',
                open
                    ? 'max-h-[400px] opacity-100'
                    : 'max-h-0 opacity-0 p-0 border-0'
            )}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {renderContentInput()}

                    {/* Word Count and Submit Button */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                        {/* Submit Button */}
                        <Button
                            disabled={postType !== 'image' && content.trim().length === 0}
                        >
                            Publish
                        </Button>
                        {/* Word Count - only show for text and link posts */}
                        {postType !== 'image' && (
                            <div className="text-sm text-muted-foreground">
                                {content.length}/280
                            </div>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
}
