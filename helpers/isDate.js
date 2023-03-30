const moment = require('moment');

const isDate = ( value ) => {

    if (!value) return false;

    const fecha = moment( value );
    // if ( fecha.isValid()){
    //     return true;
    // }else{
    //     return false;
    // }
    return (fecha.isValid());
}

module.exports = {
    isDate
}