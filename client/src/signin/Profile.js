import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import Map from '../component/Navigation'
class Profile extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      errors: {}
    }
   
  }

  refresh(){
    window.location.reload(false);
  }

  logOut(e) {
  
    localStorage.removeItem('usertoken')
    this.props.history.push(`/`)
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    this.setState({
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email
    })
  }

  render() {
    
    return (
      <div className="container">
        
        <a href="" onClick={this.logOut.bind(this)} className="nav-link">
            Logout
          </a>
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Fist Name</td>
                <td>{this.state.first_name}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{this.state.last_name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
            </tbody>
          </table>
        </div>

      <Map/>
      </div>
    )
  }
}

export default Profile
