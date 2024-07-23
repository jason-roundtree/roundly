import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

// TODO: not currently used
export default function EditPlayerPointEarned(p) {
  const params = useParams()
  const leagueId = params.leagueId as string
  const roundId = params.roundId as string
  const [searchParams] = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''
  // TODO: should i use prop or param here?
  const playerId = searchParams.get('playerId') ?? ''

  function handleDeletePointEarned() {}

  return (
    <>
      <h3 className="page-title">Edit Player Scoring</h3>
      <h3 className="page-title">{playerName}</h3>
      <button>Delete</button>
    </>
  )
}
