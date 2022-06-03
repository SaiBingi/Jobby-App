import Cookie from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookie.remove('jwt_token')

    const {history} = props

    history.replace('/login')
  }

  return (
    <ul className="header-container">
      <Link to="/" className="nav-item-link">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="home-logo"
          />
        </li>
      </Link>
      <ul className="header-link-items">
        <Link to="/" className="nav-item-link">
          <li>
            <p className="header-item">Home</p>
          </li>
        </Link>

        <Link to="/jobs" className="nav-item-link">
          <li>
            <p className="header-item">Jobs</p>
          </li>
        </Link>
      </ul>
      <li>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
      <ul className="header-link-icons">
        <Link to="/" className="nav-item-link">
          <li>
            <AiFillHome className="header-icon" />
          </li>
        </Link>
        <Link to="/jobs" className="nav-item-link">
          <li>
            <BsFillBriefcaseFill className="header-icon" />
          </li>
        </Link>
        <li>
          <FiLogOut className="header-icon" onClick={onClickLogout} />
        </li>
      </ul>
    </ul>
  )
}

export default withRouter(Header)
