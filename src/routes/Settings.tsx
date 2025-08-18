
/**
 * Settings page - placeholder for future implementation
 */
export function Settings() {
    return (
        <div className="min-h-screen pt-8">
            <div className="max-w-3xl mx-auto px-4">

                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                        Settings
                    </h1>

                    <div className="space-y-6">
                        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Account Settings
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Manage your account preferences and security settings.
                            </p>
                        </div>

                        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Notifications
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Configure how you receive notifications and updates.
                            </p>
                        </div>

                        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Privacy
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Control your privacy settings and data sharing preferences.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                                Theme
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                Customize your app appearance and theme preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
