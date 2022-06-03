import './index.css'

const FilterSection = props => {
  const {
    employmentType,
    salaryRange,
    onClickCheckbox,
    onClickRadioButton,
  } = props

  const onClickEmployType = event => {
    console.log(event.target.checked, event.target.id)
    onClickCheckbox(event.target.checked, event.target.id)
  }

  if (employmentType !== undefined) {
    return (
      <li className="checkbox-radio-container">
        <input
          type="checkbox"
          id={`checkbox ${employmentType.employmentTypeId}`}
          className="checkbox"
          onChange={onClickEmployType}
        />
        <label
          htmlFor={`checkbox ${employmentType.employmentTypeId}`}
          className="checkbox-radio-label"
        >
          {employmentType.label}
        </label>
      </li>
    )
  }

  const onClickMinimumPackage = event => {
    console.log(event.target.checked, event.target.id)
    onClickRadioButton(event.target.checked, event.target.id)
  }

  return (
    <li className="checkbox-radio-container">
      <input
        type="radio"
        id={`radio ${salaryRange.salaryRangeId}`}
        className="radio"
        name="salaryRange"
        onChange={onClickMinimumPackage}
      />
      <label
        htmlFor={`radio ${salaryRange.salaryRangeId}`}
        className="checkbox-radio-label"
      >
        {salaryRange.label}
      </label>
    </li>
  )
}

export default FilterSection
