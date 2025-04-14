export function success<T>(data: T): { status: "success"; data: T } {
    return {
        status: "success",
        data: data
    };
}

export function fail(message: string): { status: "fail"; message: string } {
    return {
        status: "fail",
        message: message
    };
}
