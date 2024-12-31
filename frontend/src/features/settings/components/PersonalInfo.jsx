import { useContext } from 'react';
import { AuthContext } from '../../../context';
import { TextInput } from "../../../components";
import { useInputField } from "../../../hooks";
import { validateFirstName, validateLastName, validatePhoneNumber, validateCountry, validateCity, validateAddress } from "../../../utils/input-validations";
import './PersonalInfo.css';

function PersonalInfo() {
    const { firstName, lastName, phoneNumber, country, city, address } = useContext(AuthContext);
    const firstNameField = useInputField(firstName, true, validateFirstName, true);
    const lastNameField = useInputField(lastName, true, validateLastName, true);
    const phoneNumberField = useInputField(phoneNumber, true, validatePhoneNumber);
    const countryField = useInputField(country, true, validateCountry);
    const cityField = useInputField(city, true, validateCity);
    const addressField = useInputField(address, true, validateAddress);

    return (
      <div className="PersonalInfo">
        <div>
            <h1 className='PersonalInfo__title'>Personal Information</h1>
            <hr/>
        </div>
        <TextInput
            label="First name"
            value={firstNameField.value}
            handleChange={firstNameField.handleChange}
            error={firstNameField.error}
            placeholder="enter your first name"
        />
        <TextInput
            label="Last name"
            value={lastNameField.value}
            handleChange={lastNameField.handleChange}
            error={lastNameField.error}
            placeholder="enter your last name"
        />
        <TextInput
            label="Phone number"
            value={phoneNumberField.value}
            handleChange={phoneNumberField.handleChange}
            error={phoneNumberField.error}
            placeholder="no phone number"
        />
        <TextInput
            label="Country"
            value={countryField.value}
            handleChange={countryField.handleChange}
            error={countryField.error}
            placeholder="no country"
        />
        <TextInput
            label="City"
            value={cityField.value}
            handleChange={cityField.handleChange}
            error={cityField.error}
            placeholder="no city"
        />
        <TextInput
            label="Address"
            value={addressField.value}
            handleChange={addressField.handleChange}
            error={addressField.error}
            placeholder="no address"
        />
      </div>
    );
}

export default PersonalInfo;