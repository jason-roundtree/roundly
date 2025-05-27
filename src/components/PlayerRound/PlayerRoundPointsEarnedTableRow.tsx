import { useState, useContext } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { RoundContext } from '../Round/RoundContainer'
import DeleteConfirmationModal from '../shared/components/DeleteConfirmationModal'
import { deletePlayerPointEarned } from '../../data'
import { PointSetting } from '../../types'

import styles from './PlayerRoundPointsEarnedTableRow.module.css'
import { PointBeingEdited } from '../shared/hooks/usePlayerPointBeingEdited'

interface PlayerRoundPointsEarnedTableRow {
  id: string
  name: string
  value: number
  hole?: number
  quantity: number
  scope: PointSetting['scope']
  // maxFrequencyPerScope: number
  playerId?: string
  playerName: string
  playerHoleId: string
  pointSettingId: string
}

export default function PlayerRoundPointsEarnedTableRow({
  id,
  name,
  value,
  hole,
  quantity,
  scope,
  // maxFrequencyPerScope,
  playerId,
  playerName,
  playerHoleId,
  pointSettingId,
}: PlayerRoundPointsEarnedTableRow): JSX.Element {
  const navigate = useNavigate()
  // const params = useParams()
  // TODO: why can't i destructure params above without TS complaining?
  // const leagueId = params.leagueId as string
  // const roundId = params.roundId as string
  // const [searchParams] = useSearchParams()
  // const playerName = searchParams.get('playerName') ?? ''
  // TODO: should i use prop or param here?
  // const playerId = searchParams.get('playerId') ?? ''

  return (
    <>
      <tr
        id={id}
        onClick={() => {
          console.log('navigate')
          navigate('edit-point-earned', {
            state: {
              pointEarnedId: id,
              pointName: name,
              pointSettingId,
              scope,
              // playerHoleId,
              playerId,
              playerName,
              value,
              originalHole: hole ?? '',
              hole: hole ?? '',
              originalQuantity: quantity,
              quantity,
              // maxFrequencyPerScope,
            },
            replace: true,
          })
        }}
      >
        <td>{name}</td>
        <td>{value}</td>
        <td>{quantity}</td>
        <td>{hole ?? ''}</td>
        {/* <td>
          <Link
            to={`/league/${leagueId}/round/${roundId}/edit-player-point-earned?playerId=${playerId}&playerName=${encodeURIComponent(
              playerName
            )}`}
          >
            Edit
          </Link>
        </td> */}
        {/* TODO: pass and call getPlayerRoundTotalPoints when delete is successful */}
        {/* <td
          onClick={() => setShowDeleteConfirmationModal(true)}
          className="tableDataAction deletePointEarned"
        >
          Delete
        </td> */}
      </tr>
    </>
  )
}
