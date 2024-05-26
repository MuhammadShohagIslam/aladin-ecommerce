export interface LoginFormValues {
    userInfo: object;
    accessToken: string;
    email: string;
    password: string;
}

export interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface OtpSendFormValue {
    otp: string;
}
export interface ResendOTPFormValues {
    phoneOrEmail: string;
}

export interface ResetPasswordFormValues {
    otp: string;
    password: string;
    confirmPassword: string;
}

export interface IUpdatePasswordFormValue {
    oldPassword: string;
    newPassword: string;
}
export interface IProfileFormValue {
    username: string;
    fullName: string;
    email: string;
    about: string;
}

export interface IAddressFormValue {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
    phoneNumber: string;
}
