export const isValidEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const isValidAtLeast = (text: string, atLeast: number) => {
    return text.length > atLeast;
};

export const isValidNoSpace = (text: string) => {
    return /^\S+$/.test(text);
};

export const isValidRequired = (text: string) => {
    return text !== "";
};


export const isContainSpecialCharacter = (text: string) => {
    return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(text);
};

export const isContainNumber = (text: string) => {
    return /\d/.test(text);
}

export const isContainUppercase = (text: string) => {
    return /[A-Z]/.test(text);
}