import moment from 'moment'

export function formatDate(date) {
    const today = new Date();
    let passedTime = today.getDate() - moment(date).date();
    if (passedTime > 1) { //Ha több mint egy nap telt el
        return moment(date).format("YYYY.MM.DD")
    }
    else {
        return moment(date).format("HH:mm")
    }
}

export function getPassedTime(date) {
    var today = new Date();
    
    let passedTime = today.getDate() - moment(date).date();
    //console.log("eltelt időtartam: " + passedTime)
    if (passedTime > 1)
    {
        return String(passedTime + " napja.");
    }
    else {
        var h = moment(today).format("HH");
        var post_h = moment(date).format("HH");
        // console.log("mai dátum " + h);
        // console.log("postIdeje: " + post_h);
        passedTime = h - post_h;
        if (passedTime > 1) {
            return String(passedTime + " órája.");
        }
        else {
            var mm = moment(today).format("mm");
            var post_m = moment(date).format("mm");
            // console.log("mai dátum " + mm);
            // console.log("postIdeje: " + post_m);
            return String(mm - post_m + " perce.");
        }
    }
}

export function getFullName(firstName, middleName, lastName) {
     //Ha nincs középső neve akkor visszaadja az vezeték és keresztnevet, máskülönben visszaadja a középsőt is
    return middleName == null ?
        firstName + " " + lastName : 
        firstName + ' ' + middleName + ' ' + lastName
}

export function getUserAvatar(token) {
    const AVATAR_URL = 'socialstream/'
    if (token) 
    {
        if (!token.includes('googleapis') && token.includes('https')) { //létezik url de nem google
            return token
        }
        return 'https://storage.googleapis.com/' + AVATAR_URL + token //A felhőből
    }
    return '/src/assets/imgs/blank_profile_pic.png';
}

export function getImage(token) {
    const PUBLIC_BUCKET = "pb_imgs/";
    const BASE_URL = "https://storage.googleapis.com/";
    if (token) {
        if (!token.includes('googleapis') && token.includes('https')) {
            return token
        }
        return BASE_URL + PUBLIC_BUCKET + token;
    }
    return '/src/assets/imgs/blank_profile_pic.png';
}

export const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};