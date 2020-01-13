const CrimeLocations = require ('../model/CrimeLocations');
const axios = require('axios')
// Need to devine mongoose some where.

module.exports = {
    getCrimeData: function (req, res) {
        CrimeLocations.find({})
        .then((result) => {
            res.json(result);
        });
    },

    addCrimeDataToDB:(req, res) => {
        // const CrimeLocation = new CrimeLocations({
        //     id: new mongoose.Types.ObjectId(),
        //     latitude: req.body.latitude,
        //     longitude: req.body.longitude,
        //     date:req.body.date
        // })
        axios.get("https://data.cityofnewyork.us/resource/uip8-fykc.json")
        .then(function(response){
        
        for (let i = 0; i < 30; i++){
                // let results = {};
                let latitude = response.data[i].latitude;
                let longitude = response.data[i].longitude;
                let date = response.data[i].arrest_date;
                // let ageGroup = response.data[i].age_group;
                // let sex = response.data[i].perp_sex;
                // let race = response.data[i].perp_race;
                // let offence = response.data[i].ofns_desc;


                // results.latitude = latitude;
                // results.longitude = longitude;
                // results.date = date;
                // results.ageGroup = ageGroup;
                // results.sex = sex;
                // results.race = race;
                // results.offence = offence;

                const CrimeLocation = new CrimeLocations({
                    id: new mongoose.Types.ObjectId(),
                    date:date,
                    latitude: latitude,
                    longitude: longitude,
                    
                })

                CrimeLocation.save(function(err){console.log(err)})

                // CrimeLocation.create(results).then(function(dbCrime){
                //     console.log(dbCrime);
                // }).catch(function(err){
                //     console.log(err);
                // })
                
            }
            
        })
        
    }


}