export const validateEmail = new RegExp("^[a-zA-Z0-9]{3,20}@gmail.com$")
export const validatePassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$') //('^(?=.*?[a-zA-z0-9]){6,}$') //('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$')

export const validateName = new RegExp("^[a-zA-Z]{2,}$")
export const validateContact = new RegExp("^[0-9]{10}$")
