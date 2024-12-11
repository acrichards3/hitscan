export type Resolve<T> = { data: T; success: true } | { error: Error; success: false };

export const resolve = async <T>(promise: Promise<T>): Promise<Resolve<T>> => {
    try {
        const data = await promise;
        return { data, success: true };
    } catch (err) {
        if (err instanceof Error) {
            return { error: err, success: false };
        }

        console.warn(`Error not instance of Error type`);
        return { error: new Error("Unknown error occurred"), success: false };
    }
};
