import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {IoOpenOutline} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Component} from 'react'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {allJobDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getJobDetails()
  }

  similarJob = job => ({
    companyLogoUrl: job.company_logo_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    location: job.location,
    rating: job.rating,
    title: job.title,
  })

  skillDetails = skill => ({
    imageUrl: skill.image_url,
    name: skill.name,
  })

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    // console.log(response)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(eachSkill =>
            this.skillDetails(eachSkill),
          ),
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(eachJob => this.similarJob(eachJob)),
      }

      //   console.log(updatedData)

      this.setState({
        allJobDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 400) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickJobDetailsRetry = () => {
    this.getJobDetails()
  }

  displayJobsLoaderView = () => (
    <div className="job-details-loader" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  displayAllJobDetails = () => {
    const {allJobDetails} = this.state
    const {jobDetails, similarJobs} = allJobDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <div className="job-details">
          <div className="company-logo-star-rating">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div className="title-star-rating">
              <h1 className="company-title">{title}</h1>
              <div className="star-rating">
                <AiFillStar className="star-icon" />
                <p className="company-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-employment-package-container">
            <div className="location-employment">
              <div className="icon-details">
                <MdLocationOn className="company-details-icon" />
                <p className="icon-detail-label">{location}</p>
              </div>
              <div className="icon-details">
                <BsFillBriefcaseFill className="company-details-icon" />
                <p className="icon-detail-label">{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line-3" />
          <div className="description-company-website">
            <h1 className="job-details-description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="visit-button-container">
              Visit <IoOpenOutline className="new-tab" />
            </a>
          </div>
          <p className="job-details-description">{jobDescription}</p>
          <h1 className="job-details-skills-heading">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachSkill => (
              <li className="skill-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-label">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-details-life-at-company-heading">
            Life at Company
          </h1>
          <div className="life-at-company">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <SimilarJobs key={eachJob.id} similarJobDetails={eachJob} />
          ))}
        </ul>
      </>
    )
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
      <button
        type="button"
        className="job-details-retry"
        onClick={this.onClickJobDetailsRetry}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displayAllJobDetails()

      case apiStatusConstants.inProgress:
        return this.displayJobsLoaderView()

      case apiStatusConstants.failure:
        return this.displayErrorInJobs()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">
          {this.renderJobDetailsView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
