import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="nav-item-link">
      <li className="job-card-container">
        <div className="company-logo-star-rating">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo-image"
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
        <h1 className="company-description-heading">Description</h1>
        <p className="company-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
