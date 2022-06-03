import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => this.setState({username: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    this.setState({showSubmitError: false})

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <div className="container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <div>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="input"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default LoginForm
