import React from 'react'

// TODO: finish implementing
export default function useHandleInputChange(
  { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
  stateSettingFn,
  change
): void {
  console.log('...args', arguments)
  stateSettingFn({ ...change, [name]: value })
}
