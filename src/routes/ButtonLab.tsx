import {
    ButtonExperimentZone,
    ButtonLabControls,
    ButtonVariantMatrix,
    type ButtonLabState,
} from '@/components/lab/ButtonLabControls';
import { useState } from 'react';

/**
 * DEV-only playground for Button variants, effects, and interactions.
 * Route: /lab/button
 */
export function ButtonLab() {
    const [state, setState] = useState<ButtonLabState>({
        variant: 'primary',
        appearance: 'filled',
        effect: 'glow',
        loading: false,
        disabled: false,
        label: 'Click me',
        iconId: 'send',
    });

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-8">
                <header className="space-y-2">
                    <p className="text-cyan-500 text-sm font-medium uppercase tracking-wide">
                        Dev only
                    </p>
                    <h1 className="text-3xl font-bold">Button Lab</h1>
                    <p className="text-muted-foreground">
                        Experiment with variants, appearances, glow, and loading states.
                    </p>
                </header>

                <ButtonLabControls
                    state={state}
                    onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
                />

                <ButtonVariantMatrix />

                <ButtonExperimentZone />
            </div>
        </div>
    );
}
