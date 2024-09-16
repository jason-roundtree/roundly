import { useState } from 'react'
import { getIncrementalHoleNumbers } from '../shared/utils'

// TODO: return Array<HTMLOptionElement> instead?
// TODO: make dynamic (and add holes field to round form)
export function selectableHoles(numberOfHoles = 18): Array<JSX.Element> {
  return ['', ...getIncrementalHoleNumbers(numberOfHoles)].map((o) => {
    return (
      <option value={o} key={o}>
        {o}
      </option>
    )
  })
}

export default function HoleSelectInput() {
  const [selectedHole, setSelectedHole] = useState('')

  function handleUpdateHole(e) {
    const holeValue = e.target.value
    if (holeValue !== '') {
      // TODO: reimplement
      //   setShowHoleRequiredError(false)
    }
    setSelectedHole(e.target.value)
  }

  return (
    <>
      <label htmlFor="hole-select">Hole</label>
      <select id="hole-select" value={selectedHole} onChange={handleUpdateHole}>
        {selectableHoles()}
      </select>
    </>
  )
}
