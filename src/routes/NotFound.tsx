import { Card } from '@/components/ui/Card';

export function NotFound() {
    return (
        <Card className="p-6">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Page not found
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
                The page you are looking for does not exist.
            </p>
        </Card>
    );
}
