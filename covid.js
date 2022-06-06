const axios = require("axios");

module.exports = {
    getReport: (date) =>
        axios({
            method: 'GET',
            url: 'https://covid-19-statistics.p.rapidapi.com/reports',
            params: { iso: 'EGY', region_name: 'Egypt', date: date },
            headers: {
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
                'X-RapidAPI-Key': '6c617929e3mshf6d2c98ef307f3ep13b436jsnd686e8f4546e'
            }
        }),
    getWorldReport: (date) =>
    axios({    
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/reports/total',
        params: {date: date},
        headers: {
          'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
          'X-RapidAPI-Key': '6c617929e3mshf6d2c98ef307f3ep13b436jsnd686e8f4546e'
        } 
    })       
}