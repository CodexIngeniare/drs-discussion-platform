import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context';
import { TextInput } from "../../../components";
import { useInputField } from "../../../hooks";
import { validateFirstName, validateLastName, validatePhoneNumber, validateCountry, validateCity, validateAddress } from "../../../utils/input-validations";
import { useUpdateUserData } from './hooks';
import { useFetchAccountData } from '../../../hooks';
import './PersonalInfo.css';

function PersonalInfo() {
    const { firstName, lastName, phoneNumber, country, city, address, loadContextFromSession } = useContext(AuthContext);
    const firstNameField = useInputField(firstName, true, validateFirstName, true);
    const [isFirstNameModified, setIsFirstNameModified] = useState(false);
    const lastNameField = useInputField(lastName, true, validateLastName, true);
    const [isLastNameModified, setIsLastNameModified] = useState(false);
    const phoneNumberField = useInputField(phoneNumber, true, validatePhoneNumber);
    const [isPhoneNumberModified, setIsPhoneNumberModified] = useState(false);
    const countryField = useInputField(country, true, validateCountry);
    const [isCountryModified, setIsCountryModified] = useState(false);
    const cityField = useInputField(city, true, validateCity);
    const [isCityModified, setIsCityModified] = useState(false);
    const addressField = useInputField(address, true, validateAddress);
    const [isAddressModified, setIsAddressModified] = useState(false);

    const { isUpdating, updatePersonalInfo } = useUpdateUserData("http://127.0.0.1:5000/update_user_data");
    const { fetchAccountData } = useFetchAccountData("http://127.0.0.1:5000/user_data");

    useEffect(() => {
        if(firstNameField.value !== firstName && firstNameField.isValid){
            setIsFirstNameModified(true);
        } else{
            setIsFirstNameModified(false);
        }
        if(lastNameField.value !== lastName && lastNameField.isValid){
            setIsLastNameModified(true);
        } else{
            setIsLastNameModified(false);
        }
        if(phoneNumberField.value !== phoneNumber && phoneNumberField.isValid){
            setIsPhoneNumberModified(true);
        } else{
            setIsPhoneNumberModified(false);
        }
        if(countryField.value !== country && countryField.isValid){
            setIsCountryModified(true);
        } else{
            setIsCountryModified(false);
        }
        if(cityField.value !== city && cityField.isValid){
            setIsCityModified(true);
        } else{
            setIsCityModified(false);
        }
        if(addressField.value !== address && addressField.isValid){
            setIsAddressModified(true);
        } else{
            setIsAddressModified(false);
        }
    }, [firstNameField.value, lastNameField.value, phoneNumberField.value, countryField.value, cityField.value, addressField.value]);
    const validateInputFields = () => {
        let valid = true;

        firstNameField.validate();
        lastNameField.validate();
        phoneNumberField.validate();
        countryField.validate();
        cityField.validate();
        addressField.validate();

        if(!firstNameField.isValid){
            valid = false;
        }
        if(!lastNameField.isValid){
            valid = false;
        }
        if(!phoneNumberField.isValid){
            valid = false;
        }
        if(!countryField.isValid){
            valid = false;
        }
        if(!cityField.isValid){
            valid = false;
        }
        if(!addressField.isValid){
            valid = false;
        }
        if(!isFirstNameModified
            && !isLastNameModified
            && !isPhoneNumberModified
            && !isCountryModified
            && !isCityModified
            && !isAddressModified){
            valid = false;
        }
        return valid;
    };
    const sendInputUpdates = async () => {
        if(isUpdating){
            return;
        }
        if(!validateInputFields()){
            return;
        }
        if(await updatePersonalInfo(firstNameField.value, lastNameField.value, phoneNumberField.value, countryField.value, cityField.value, addressField.value)){
            const token = sessionStorage.getItem("token");
            if(await fetchAccountData(token)){
                loadContextFromSession();
                setIsFirstNameModified(false);
                setIsLastNameModified(false);
                setIsPhoneNumberModified(false);
                setIsCountryModified(false);
                setIsCityModified(false);
                setIsAddressModified(false);
            }
        }
    };

    return (
      <div className="PersonalInfo">
        <div>
            <h1 className='PersonalInfo__title'>Personal Information</h1>
            <hr/>
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="First name"
                value={firstNameField.value}
                handleChange={firstNameField.handleChange}
                error={firstNameField.error}
                required={firstNameField.error}
                placeholder="enter your first name"
            />
            { isFirstNameModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="Last name"
                value={lastNameField.value}
                handleChange={lastNameField.handleChange}
                error={lastNameField.error}
                required={lastNameField.error}
                placeholder="enter your last name"
            />
            { isLastNameModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="Phone number"
                value={phoneNumberField.value}
                handleChange={phoneNumberField.handleChange}
                error={phoneNumberField.error}
                placeholder="no phone number"
            />
            { isPhoneNumberModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="Country"
                value={countryField.value}
                handleChange={countryField.handleChange}
                error={countryField.error}
                placeholder="no country"
            />
            { isCountryModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="City"
                value={cityField.value}
                handleChange={cityField.handleChange}
                error={cityField.error}
                placeholder="no city"
            />
            { isCityModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <div className='PersonalInfo__field-container'>
            <TextInput
                label="Address"
                value={addressField.value}
                handleChange={addressField.handleChange}
                error={addressField.error}
                placeholder="no address"
            />
            { isAddressModified && <span className='PersonalInfo__modified-message'>Modified</span> }
        </div>
        <button className='PersonalInfo__change-button' onClick={sendInputUpdates}>Update</button>
      </div>
    );
}

export default PersonalInfo;