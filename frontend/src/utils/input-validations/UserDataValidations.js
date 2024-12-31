
export function validateEmail(email){
    const emailRegex = /\S+@\S+\.\S+/;
    let isValid = true;
    let errorMessage = "";

    /*if (!email || email === '') {
        isValid = false;
        errorMessage = "Email is required.";
    } else*/ if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage = "Please enter a valid email.";
    }
    return { isValid, errorMessage };
};
export function validateLoginPassword(password){
    let isValid = true;
    let errorMessage = "";

    /*if (!password) {
        isValid = false;
        errorMessage = "Password is required.";
    }*/
    return { isValid, errorMessage };
};
export function isRegisterPasswordValid(password, outErrors = {}){
    if (!password) {
        outErrors.password = "Password is required.";
        return false;
    }
    return true;
};
export function validateUsername(username){
    const maxLength = 50;
    let isValid = true;
    let errorMessage = "";

    /*if (!username) {
        isValid = false;
        errorMessage = "Username is required.";
    } else*/ if(username.length >= maxLength){
        isValid = false;
        errorMessage = "Username length exceeded.";
    }
    // username min/max length?
    // username allowed characters?
    return { isValid, errorMessage };
};
export function validateFirstName(firstName){
    const nameRegex = /^[A-Za-z]+$/;
    const maxLength = 100;
    let isValid = true;
    let errorMessage = "";

    if(!firstName){
        isValid = false;
        errorMessage = "First name is required.";
    } else if(!nameRegex.test(firstName)){
        isValid = false;
        errorMessage = "First name can contain only letters & 1 word.";
    } else if(firstName.length >= maxLength){
        isValid = false;
        errorMessage = "First name length exceeded.";
    }
    return { isValid, errorMessage};
};
export function validateLastName(lastName){
    const nameRegex = /^[A-Za-z]+$/;
    const maxLength = 100;
    let isValid = true;
    let errorMessage = "";

    if(!lastName){
        isValid = false;
        errorMessage = "Last name is required.";
    } else if(!nameRegex.test(lastName)){
        isValid = false;
        errorMessage = "Last name can contain only letters & 1 word.";
    } else if(lastName.length >= maxLength){
        isValid = false;
        errorMessage = "Last name length exceeded.";
    }
    return { isValid, errorMessage };
};
export function validatePhoneNumber(phoneNumber){
    const phoneRegex = /^(?:\+?(\d{1,3}))?[-.\s]?(?:\(?(\d{1,4})\)?[-.\s]?)(\d{1,4})[-.\s]?(\d{1,4})$/;
    let isValid = true;
    let errorMessage = "";

    if(phoneNumber === ""){
        isValid = true;
        errorMessage = "";
        return { isValid, errorMessage };
    }

    if(!phoneRegex.test(phoneNumber)){
        isValid = false;
        errorMessage = "Phone number of wrong format.";
    }
    return { isValid, errorMessage };
};
export function validateCountry(country){
    const maxLength = 100;
    let isValid = true;
    let errorMessage = "";

    if(country === "kosovo" || country === "Kosovo"){
        isValid = false;
        errorMessage = "Kosovo is Serbia.";
    } else if(country.length >= maxLength){
        isValid = false;
        errorMessage = "Country input length exceeded.";
    }
    return { isValid, errorMessage };
};
export function validateCity(city){
    const maxLength = 100;
    let isValid = true;
    let errorMessage = "";

    if(city.length >= maxLength){
        isValid = false;
        errorMessage = "City input length exceeded.";
    }
    return { isValid, errorMessage };
};
export function validateAddress(address){
    const maxLength = 255;
    let isValid = true;
    let errorMessage = "";

    if(address.length >= maxLength){
        isValid = false;
        errorMessage = "Address input length exceeded.";
    }
    return { isValid, errorMessage };
};