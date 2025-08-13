interface AvatarProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * Avatar component - displays a circular avatar image
 * Use Tailwind classes like w-8, w-12, w-16 for sizing
 * Component automatically maintains 1:1 aspect ratio
 */
export function Avatar({ src, alt, className = '' }: AvatarProps) {
    return (
        <div className={`rounded-full overflow-hidden aspect-square ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
