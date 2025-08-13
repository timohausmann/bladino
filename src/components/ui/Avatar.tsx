interface AvatarProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}

/**
 * Avatar component - displays a circular avatar image
 */
export function Avatar({ src, alt, size = 12, className = '' }: AvatarProps) {
    return (
        <div className={`w-${size} h-${size} rounded-full overflow-hidden ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
