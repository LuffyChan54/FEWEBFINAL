export { default as Input } from "./input";

export type InputProperties = {
    placeHolder?: string,
    type: string,
    label?: string,
    name: string
}
export type InputOptions = {
    input: InputProperties,
    isSubmit?: boolean,
    event?: {
        value: {
            isValid: boolean,
            value: string
        },
        handle: (e: any) => void
    },
    validation?: {
        isEmail?: boolean,
        isRequire?: boolean,
        atLeast?: number,
        noSpace?: boolean,
        contain?: {
            specialChar?: boolean,
            uppercase?: boolean,
            number?: boolean
        }
    }
}

