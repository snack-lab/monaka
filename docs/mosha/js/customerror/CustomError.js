class CustomError extends Error {
    static {
        this.prototype.name = "CustomError";
    }

    constructor(message = "", options = {}) {
        const { customProp, ...rest } = options;
        super(message, rest);
        this.customProp = customProp;
    }
}

try {
    throw new CustomError("This is a custom error");
} catch (error) {
    if (Error.isError(error)) {
        console.debug(error.message, error);
    }
}
