// this application will validate the characters in a string
// You can modify this to suits your needs.
// Below is only the basic implementation, you can add more

const stringChars = /^[a-zA-ZÑñ\s._-]+$/;
const telVal = /^09\d+$/;
const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const alphaNumeric = /^[a-zA-Z0-9Ññ\s._-]+$/;
const alphaNumericNoSpace = /^[a-zA-Z0-9Ññ._-]+$/;

const valString =  (value) => {
    if (stringChars.test(value)) {
        return true
    }
    else {
        return false
    }
};

const valTel =  (value) => {

    if (telVal.test(value)) {
        return true
    }
    else {
        return false
    }
}

const valEmailFornat = (value) => {

    if (emailRegex.test(value)) {
        return true
    }
    else {
        return false
    }
}

const VarChar = () => {
    function isAlphaNumeric(value) {
        if (alphaNumeric.test(value)) {
            return true; // if the string contains alphanumeric only and has whitespace, return true
        }
        else {
            return false; // if the string contains other characters and has whitespace, return false
        }
    }

    function NoSpace(value) {
        if (alphaNumericNoSpace.test(value)) {
            return true; // if the string contains alphanumeric and DOES not have whitespaces, return true;
        }
        else {
            return false; // if the string contains alphanumeric and HAS whitespaces, return false;
        }
    }

    return {isAlphaNumeric, NoSpace}
};

module.exports = {
    valString,
    valTel,
    valEmailFornat,
    VarChar
}