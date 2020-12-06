'use strict'
const whois = require('whois')

exports.handler = (event, context, callback) => {
    lookupAddress(event.address, response => {
        callback(null, response)
    })
}


export const lookupAddress = (address, callback) => {
    whois.lookup(address, (err, data) => {
        if (err) {
            callback("Failed to get data on address")
        }
        callback(processData(data))
    })
}


// filter out extra junk related to the whois lookup itself and not the address
export const processData = (data) => {

    let arr = data.split("\n")

    let processed = ""
    for (let i = 0; i < arr.length; i++) {
        const str = arr[i]
        if (str.indexOf("Registrar") > -1) continue
        if (str.indexOf("Domain Status") > -1) continue
        if (str.indexOf("DNSSEC") > -1) break
        if (str.indexOf("% This is the RIPE Database query service.") > -1) {
            return "ERROR_BAD_ADDRESS"
        }

        processed += str + "\n"
    }

    return processed
}