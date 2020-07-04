import moment from 'moment';

export const bufferToBase64 = (bufferFrom) => {
    return Buffer.from(bufferFrom).toString("base64");
}

export const lastItemOfArray = (array) => {
    if (!array.length) {
        return [];
    }
    return array[array.length - 1];
}

export const convertTimestamp = (timestamp) => {
    if (!timestamp) {
        return "";
    }

    return moment(timestamp).locale("en").startOf("seconds").fromNow();
}