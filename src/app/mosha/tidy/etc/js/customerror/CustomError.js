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
