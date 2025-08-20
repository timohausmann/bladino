import { Back } from '@/components/ui/Back';
import { Card } from '@/components/ui/Card';

export function NotFound() {
    return (
        <div className="min-h-screen pt-8">
            <div className="max-w-3xl mx-auto px-4 space-y-4">

                <Back />

                <Card className="p-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Page not found
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        The page you are looking for does not exist.
                    </p>
                </Card>
            </div>
        </div>
    );
}
