import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import JobCard from '../JobCard'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobs: [],
    jobsApiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
    employmentTypes: [],
    minimumPackage: '',
    searchInput: '',
  }

  componentDidMount = () => {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 400) {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {minimumPackage, searchInput, employmentTypes} = this.state

    let updatedEmploymentType

    if (employmentTypes.length === 0) {
      updatedEmploymentType = ''
    } else {
      updatedEmploymentType = employmentTypes.join(',')
    }

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${updatedEmploymentType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobs: updatedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 400) {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeMinimumPackage = event => {
    this.setState({minimumPackage: event.target.id}, this.getJobs)
  }

  onChangeEmployType = event => {
    const employType = event.target.id
    const {employmentTypes} = this.state

    const inputNotInList = employmentTypes.filter(
      eachItem => eachItem === employType,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          employmentTypes: [...prevState.employmentTypes, employType],
        }),
        this.getJobs,
      )
    } else {
      const filteredEmploymentTypes = employmentTypes.filter(
        eachEmploymentType => eachEmploymentType !== employType,
      )

      this.setState({employmentTypes: filteredEmploymentTypes}, this.getJobs)
    }
  }

  displayProfileDetails = () => {
    const {profileDetails} = this.state

    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile" />
        <p className="profile-name">{name}</p>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetry = () => {
    this.getProfile()
  }

  displayErrorInProfile = () => (
    <div className="error-profile">
      <button
        type="button"
        className="retry"
        onClick={this.onClickProfileRetry}
      >
        Retry
      </button>
    </div>
  )

  displayProfileLoaderView = () => (
    <div className="loader-profile-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayJobsLoaderView = () => (
    <div className="loader-jobs-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.displayProfileDetails()

      case apiStatusConstants.failure:
        return this.displayErrorInProfile()

      case apiStatusConstants.inProgress:
        return this.displayProfileLoaderView()

      default:
        return null
    }
  }

  onClickJobRetry = () => {
    this.getJobs()
  }

  displayErrorInJobs = () => (
    <div className="error-jobs">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="error-message">Oops! Something Went Wrong</h1>
      <p className="error-message-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry" onClick={this.onClickJobRetry}>
        Retry
      </button>
    </div>
  )

  displayAllJobs = () => {
    const {jobs} = this.state
    const noJobs = jobs.length === 0
    return noJobs ? (
      <div className="error-jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="failure-view"
        />
        <h1 className="error-message">No Jobs Found</h1>
        <p className="error-message-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="job-cards-container">
        {jobs.map(eachJob => (
          <JobCard key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobsView = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.displayAllJobs()

      case apiStatusConstants.failure:
        return this.displayErrorInJobs()

      case apiStatusConstants.inProgress:
        return this.displayJobsLoaderView()

      default:
        return null
    }
  }

  renderEmploymentTypesView = () => (
    <ul className="employment-container">
      {employmentTypesList.map(eachEmploymentType => (
        <li
          className="checkbox-radio-container"
          key={eachEmploymentType.employmentTypeId}
        >
          <input
            type="checkbox"
            id={eachEmploymentType.employmentTypeId}
            className="checkbox"
            onChange={this.onChangeEmployType}
          />
          <label
            htmlFor={eachEmploymentType.employmentTypeId}
            className="checkbox-radio-label"
          >
            {eachEmploymentType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  renderSalaryRangeView = () => (
    <ul className="salary-range-container">
      {salaryRangesList.map(eachPackage => (
        <li
          className="checkbox-radio-container"
          key={eachPackage.salaryRangeId}
        >
          <input
            type="radio"
            id={eachPackage.salaryRangeId}
            className="radio"
            name="salaryRange"
            onChange={this.onChangeMinimumPackage}
          />
          <label
            htmlFor={eachPackage.salaryRangeId}
            className="checkbox-radio-label"
          >
            {eachPackage.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    this.getJobs()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="bg-jobs-container">
          <div className="filter-section-container">
            <div className="input-container-mobile">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>

            {this.renderProfileView()}

            <hr className="hr-line" />
            <h1 className="filter-section-heading">Type of Employment</h1>

            {this.renderEmploymentTypesView()}

            <hr className="hr-line-2" />
            <h1 className="filter-section-heading">Salary Range</h1>

            {this.renderSalaryRangeView()}
          </div>
          <div className="jobs-section-container">
            <div className="input-container-desktop">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>

            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
