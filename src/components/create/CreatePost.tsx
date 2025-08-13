import clsx from 'clsx';
import { useState } from 'react';
import { Image, Link, Type, X } from 'react-feather';
import { HeaderButton } from '../ui/HeaderButton';
import { CreateImage } from './CreateImage';
import { CreateLink } from './CreateLink';
import { CreateText } from './CreateText';

type PostType = 'text' | 'image' | 'link';

interface CreatePostProps {
    open: boolean;
    onClose: () => void;
}

/**
 * CreatePost component - integrated into Home page for creating new posts
 */
export function CreatePost({ open, onClose }: CreatePostProps) {
    const [postType, setPostType] = useState<PostType>('text');
    const [content, setContent] = useState('');

    const handlePostTypeChange = (type: PostType) => {
        setPostType(type);
        setContent(''); // Clear content when switching types
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
            'relative transition-all duration-300 flex flex-col gap-4 rounded-xl border border-transparent',
            open && 'bg-card border-white dark:border-white/10 p-6'
        )}>
            {/* Post Type Selector with Close Button */}
            <div className={clsx(
                'flex justify-between items-center transition-opacity duration-300',
                open ? 'opacity-100' : 'opacity-60'
            )}>
                <div className="flex gap-2">
                    <HeaderButton
                        onClick={() => handlePostTypeChange('text')}
                        icon={<Type size={20} />}
                        label="Text Post"
                        active={open && postType === 'text'}
                    />
                    <HeaderButton
                        onClick={() => handlePostTypeChange('image')}
                        icon={<Image size={20} />}
                        label="Image Post"
                        active={open && postType === 'image'}
                    />
                    <HeaderButton
                        onClick={() => handlePostTypeChange('link')}
                        icon={<Link size={20} />}
                        label="Link Post"
                        active={open && postType === 'link'}
                    />
                </div>

                {/* Close button - only visible when open */}
                {open && (
                    <HeaderButton
                        onClick={(e) => {
                            e?.stopPropagation();
                            onClose();
                        }}
                        icon={<X size={20} />}
                        label="Close post creation"
                    />
                )}
            </div>

            {/* Content Input - only visible when open */}
            {open && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {renderContentInput()}

                    {/* Word Count and Submit Button */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={postType !== 'image' && content.trim().length === 0}
                            className="px-6 py-2 bg-white/90 text-black hover:bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-full font-medium transition-colors"
                        >
                            Publish
                        </button>
                        {/* Word Count - only show for text and link posts */}
                        {postType !== 'image' && (
                            <div className="text-sm text-muted-foreground">
                                {content.length}/280
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}
