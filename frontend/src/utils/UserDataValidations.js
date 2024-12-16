
export function isEmailValid(email, outErrors = {}){
    const emailRegex = /\S+@\S+\.\S+/

    if (!email || email === '') {
        outErrors.email = "Email is required.";
        return false;
    } else if (!emailRegex.test(email)) {
        outErrors.email = "Please enter a valid email.";
        return false;
    }
    return true;
};
export function isLoginPasswordValid(password, outErrors = {}){
    if (!password) {
        outErrors.password = "Password is required.";
        return false;
    }
    return true;
};
export function isRegisterPasswordValid(password, outErrors = {}){
    if (!password) {
        outErrors.password = "Password is required.";
        return false;
    }
    return true;
};
export function isUsernameValid(username, outErrors = {}){
    const maxLength = 50;

    if (!username) {
        outErrors.username = "Username is required.";
        return false;
    } else if(username.length >= maxLength){
        outErrors.username = "Username length exceeded.";
        return false;
    }
    // username min/max length?
    // username allowed characters?
    return true;
};
export function isFirstNameValid(first_name, outErrors = {}){
    const nameRegex = /^[A-Za-z]+$/;
    const maxLength = 100;

    if(!first_name){
        outErrors.first_name = "First name is required.";
        return false;
    } else if(!nameRegex.test(first_name)){
        outErrors.first_name = "First name can contain only letters & 1 word.";
        return false;
    } else if(first_name.length >= maxLength){
        outErrors.first_name = "First name length exceeded.";
        return false;
    }
    return true;
};
export function isLastNameValid(last_name, outErrors = {}){
    const nameRegex = /^[A-Za-z]+$/;
    const maxLength = 100;

    if(!last_name){
        outErrors.last_name = "Last name is required.";
        return false;
    } else if(!nameRegex.test(last_name)){
        outErrors.last_name = "Last name can contain only letters & 1 word.";
        return false;
    } else if(last_name.length >= maxLength){
        outErrors.last_name = "Last name length exceeded.";
        return false;
    }
    return true;
};
export function isPhoneNumberValid(phone_number, outErrors){
    const phoneRegex = /^(?:\+?(\d{1,3}))?[-.\s]?(?:\(?(\d{1,4})\)?[-.\s]?)(\d{1,4})[-.\s]?(\d{1,4})$/;

    if(phone_number === "")
        return true;

    if(!phoneRegex.test(phone_number)){
        outErrors.phone_number = "Phone number of wrong format.";
    }
    return true;
};
export function isCountryValid(country, outErrors){
    const maxLength = 100;

    if(country === "kosovo" || country === "Kosovo"){
        outErrors.country = "Kosovo is Serbia.";
        return false;
    } else if(country.length >= maxLength){
        outErrors.country = "Country input length exceeded.";
        return false;
    }
    return true;
};
export function isCityValid(city, outErrors){
    const maxLength = 100;

    if(city.length >= maxLength){
        outErrors.city = "City input length exceeded.";
        return false;
    }
    return true;
};
export function isAddressValid(address, outErrors){
        const maxLength = 255;

        if(address.length >= maxLength){
            outErrors.address = "Address input length exceeded.";
            return false;
        }
        return true;
};