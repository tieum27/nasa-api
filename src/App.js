import React, { Component } from 'react';
import { PageHeader, Table, Jumbotron } from 'react-bootstrap';
import sampleNeo from './sample-neo.js'

class App extends Component {
  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      apiKey: "E4t11IUm3CJ7NrvIHmlx8T9LWDK8VKpklpoKHfzA",
      startDate:`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      rawData: sampleNeo,
      asteroids: []
    }
  }
  componentWillMount(){
    fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then((rawResponse)=>{
      // rawResponse.json() returns a promise that we pass along
      return rawResponse.json()
    }).then((parsedResponse) => {

      // when this promise resolves, we can work with our data
      let neoData = parsedResponse.near_earth_objects

      let newAsteroids = []
      Object.keys(neoData).forEach((date)=>{
        neoData[date].forEach((asteroid) =>{
          newAsteroids.push({
            id: asteroid.neo_reference_id,
            name: asteroid.name,
            date: asteroid.close_approach_data[0].close_approach_date,
            diameterMin: asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0),
            diameterMax: asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0),
            closestApproach: asteroid.close_approach_data[0].miss_distance.kilometers,
            velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0),
            distance: asteroid.close_approach_data[0].miss_distance.kilometers,
            hazardous: asteroid.is_potentially_hazardous_asteroid.toString(),
          })
        })
      })

      // state is updated when promises are resolved
      this.setState({asteroids: newAsteroids})
    })
  }
  render() {
    return (
      <div className="App">
        <div className="container" >
          <PageHeader>
            <img src="./images/asteroid.png" alt="Asteroid" />
            NASA Meteor
            <img src="./images/meteor-1.png" alt="Meteor" />
          </PageHeader>
          <Jumbotron>
          </Jumbotron>

          <h2>List of the closest Meteors to Earth</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Estimated Diameter (meters)</th>
                <th>Date of Closest Approach</th>
                <th>Distance (kilometers)</th>
                <th>Velocity (kilometers/hour)</th>
                <th>Is Hazardous?</th>
              </tr>
            </thead>
            <tbody>
              {this.state.asteroids.map((asteroid)=>{
                return(
                  <tr key={asteroid.id} className={ asteroid.hazardous == "true" ? "danger" : ""}>
                    <td>{asteroid.name}</td>
                    <td>{asteroid.diameterMin} - {asteroid.diameterMax}</td>
                    <td>{asteroid.date}</td>
                    <td>{asteroid.distance}</td>
                    <td>{asteroid.velocity}</td>
                    <td>{asteroid.hazardous}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default App;
