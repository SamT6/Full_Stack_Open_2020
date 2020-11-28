import React, {useState, useEffect} from 'react';
import axios from 'axios';


const Countries = ({countries, setSearch, setShowOne}) => {
  

  const handleButton = (country_name) => {
    console.log("searching...", country_name);
    setShowOne(true);
    setSearch(country_name);
  }

  if(countries.length > 10){
    return(
      <p>Too many matches, specify another filter</p>
    )
  }
  else if(countries.length > 1){
    return(
      <ul>
          {countries.map((country, index)=>
            <div>
              <li key={index}>{country['name']}</li>
              <button onClick={() => handleButton(country['name'])}>show</button>
            </div>
          )}
      </ul>
    )
  }
  else{
    return(
      <p>please input a country name</p>
    )
  }
  
}

const Country = ({search}) => {
  const [country, setCountry] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [weather, setWeather] = useState({})
  console.log("render....!!!");
  console.log("country", country);

  

  useEffect(()=>{
    const api_key = process.env.REACT_APP_API_KEY
    const get_weather_data = (city) => {
      console.log("country is finally...", country);
      const weather_api = 'http://api.weatherstack.com/current?access_key=' + api_key + '&query='+city;
      console.log(weather_api);
      axios.get(weather_api)
           .then(response => {
              console.log(response.data);
              setWeather(response.data);
              setDataLoaded(true);
           })
    }  
    
    axios.get('https://restcountries.eu/rest/v2/name/'+search)
         .then(response => {
            console.log(response.data);
            get_weather_data(response.data[0]['capital']) //pass on info before setState and re-render
            setCountry(response.data[0]);
            console.log("country inside...",country); // can't access country at this point 
            
         })     
  }, [])
  
  if(dataLoaded === true){
    return(
      <div>
        <h1>{country['name']}</h1>
        <p>capital {country['capital']}</p>
        <p>population {country['population']}</p>
        <br/>
        <h2>languages</h2>
        <ul>
          { country['languages'].map(
            language => <li>{language['name']}</li>
          )}
        </ul>
        <img src={country['flag']}  style={{width:200, height:100}}  ></img>
        
        <h2>Weather in {country['capital']}</h2>
        <p>time {weather['location']['localtime']}</p>
        <p>{weather['current']['weather_descriptions']}</p>
        <p>temperature: {weather['current']['temperature']}</p>
        <img src={weather['current']['weather_icons']}></img>
        <p>wind: {weather['current']['wind_speed']} mph direction {weather['current']['wind_dir']}</p>

      </div>
      
    )
  }
  else{
    return(
      <div></div>
    )
  }
}


const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [all_countries, setAllCountries] = useState([]);
  const [showOneCountry, setShowOneCountry] = useState(false);


  //load all contry data on first render
  useEffect(()=>{
    axios.get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      console.log(response.data);
       setAllCountries(response.data);
    })
  }, []);


  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCountries(all_countries.filter(
      country => country['name'].toLowerCase().includes(search.toLowerCase())
    )) 
    console.log("countries selected: ", countries);

    if(countries.length === 1){
      console.log('showing one country...');
      setShowOneCountry(true);
    }
    else{
      console.log('showing multiple countries...');
      setShowOneCountry(false);
    }
  }

  return(
    <div>
        <div>
          find countries: 
          <input value={search} onChange={handleSearchChange} />
        </div>
        {showOneCountry ? <Country search={search} /> : 
        <Countries countries={countries} setSearch={setSearch} setShowOne={setShowOneCountry} />
        }
    </div>
  )
}

export default App;