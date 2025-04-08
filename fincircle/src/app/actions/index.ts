export function success(data: unknown) {
    return {
        status: "success",
        data: data
    }
}

export function fail(message: string) {
    return {
        status: "fail",
        message: message
    }
}