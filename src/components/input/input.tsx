import { InputOptions } from ".";
import {
    isContainNumber, isContainSpecialCharacter, isContainUppercase,
    isValidAtLeast, isValidEmail, isValidNoSpace, isValidRequired
} from "utils/stringValidate";
import "./input.css";
import { useEffect, useState } from "react";

const validateInput = (validation: any, value: string) => {
    const _errors = []
    if (validation?.isRequire && !isValidRequired(value)) {
        _errors.push({
            isRequired: false,
            message: "This field is required"
        });
    }

    if (validation?.isEmail && !isValidEmail(value)) {
        _errors.push({
            isEmail: false,
            message: "This field must be an email"
        });
    }

    if (validation?.atLeast && !isValidAtLeast(value, validation.atLeast)) {
        _errors.push({
            isAtLeast: false,
            message: "This field must at least " + validation.atLeast + " characters"
        });
    }

    if (validation?.noSpace && !isValidNoSpace(value)) {
        _errors.push({
            isNoSpace: false,
            message: "This field must have no spacing"
        });
    }

    if (validation?.contain?.uppercase && !isContainUppercase(value)) {
        _errors.push({
            isContainUppercase: false,
            message: "This field must have at least 1 uppercase"
        });
    }

    if (validation?.contain?.specialChar && !isContainSpecialCharacter(value)) {
        _errors.push({
            isContainSpecialChar: false,
            message: "This field must have at least 1 specific character"
        });
    }

    if (validation?.contain?.number && !isContainNumber(value)) {
        _errors.push({
            isContainNumber: false,
            message: "This field must have at least 1 number"
        });
    }
    return _errors;
}

export default function Input({ input, event, validation, isSubmit }: InputOptions) {
    const [errors, setErrors] = useState<any[]>([]);
    useEffect(() => {
        if (isSubmit === true) {
            const _errors = validateInput(validation, event?.value.value || "");
            event?.handle({
                value: event?.value.value,
                isValid: _errors.length === 0
            })
            setErrors(_errors);
        }
    }, [isSubmit])
    const { placeHolder, type, label, name } = input;
    const handleInputValueChanged = (e: any) => {
        let _errors = [...errors];
        const value = e.target.value;
        if (validation?.isRequire && isValidRequired(value)) {
            _errors = _errors.filter(err => {
                return err.isRequired === undefined
            });
        }

        if (validation?.isEmail && isValidEmail(value)) {
            _errors = _errors.filter(err => {
                return err.isEmail === undefined;
            });
        }

        if (validation?.atLeast && isValidAtLeast(value, validation.atLeast)) {
            _errors = _errors.filter(err => {
                return err.isAtLeast === undefined
            });
        }

        if (validation?.noSpace && isValidNoSpace(value)) {
            _errors = _errors.filter(err => {
                return err.isNoSpace === undefined
            });
        }

        if (validation?.contain?.uppercase && isContainUppercase(value)) {
            _errors = _errors.filter(err => {
                return err.isContainUppercase === undefined
            });
        }

        if (validation?.contain?.specialChar && isContainSpecialCharacter(value)) {
            _errors = _errors.filter(err => {
                return err.isContainSpecialChar === undefined
            });
        }

        if (validation?.contain?.number && isContainNumber(value)) {
            _errors = _errors.filter(err => {
                return err.isContainNumber === undefined
            });
        }

        setErrors(_errors);
        event?.handle({
            value: e.target.value,
            isValid: _errors.length === 0
        });
    }
    const handleInputValueBlur = (e: any) => {
        const value = e.target.value;
        const _errors = validateInput(validation, value);
        setErrors(_errors);
    }
    return <div className="form-input">
        <div className="form-style">
            <input
                className={`form-input__input ${errors.length !== 0 ? "invalid" : ""}`}
                name={name}
                type={type}
                value={event?.value.value}
                onChange={(e) => handleInputValueChanged(e)}
                onBlur={(e) => handleInputValueBlur(e)}
                placeholder={label ? " " : placeHolder || " "} />
            <label className="form-input__label">{label}</label>
        </div>
        {errors.map((err, index) => {
            return <span className="form-input__errorMessage" key={index}>
                <i className="uil uil-exclamation-octagon"></i>{err.message}</span>
        })}
    </div>
}