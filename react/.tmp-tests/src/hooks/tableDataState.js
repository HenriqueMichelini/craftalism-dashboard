function toErrorMessage(error) {
    return error instanceof Error ? error.message : "Failed to fetch data";
}
export async function loadTableData(fetchFn) {
    try {
        const data = await fetchFn();
        return { data, loading: false, error: null };
    }
    catch (error) {
        return {
            data: [],
            loading: false,
            error: toErrorMessage(error),
        };
    }
}
