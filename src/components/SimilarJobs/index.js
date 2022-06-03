import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    <li className="similar-job-container">
      <div className="company-logo-star-rating">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="similar-job-details-description-heading">Description</h1>
      <p className="similar-job-details-description">{jobDescription}</p>
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
    </li>
  )
}

export default SimilarJobs
