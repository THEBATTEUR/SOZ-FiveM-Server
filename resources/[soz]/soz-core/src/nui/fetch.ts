import { NuiEvent } from '../shared/event';

export type FetchNuiOptions = {
    timeout: number | false;
};

export const fetchNui = async <I, R>(event: NuiEvent, input?: I, options?: FetchNuiOptions): Promise<R> => {
    const timeout = options?.timeout ?? false;
    const controller = new AbortController();
    const id = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    if (typeof window.GetParentResourceName === 'undefined') {
        return null;
    }

    try {
        const response = await fetch(`https://${GetParentResourceName()}/` + event.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(input || null),
            signal: controller.signal,
        });

        if (response.status === 404) {
            throw new Error(`Nui event ${event.toString()} no handler found`);
        }

        return (await response.json()) as R;
    } catch (e) {
        console.error(`Failed to fetch ${event.toString()}`, e);
        throw e;
    } finally {
        if (id) {
            clearTimeout(id);
        }
    }
};
