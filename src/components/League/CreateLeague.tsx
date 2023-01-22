import { useState, createContext } from 'react'
import { v4 as uuid } from 'uuid'
import { PointSetting } from '../../types'
import { Player } from '../../types'
import BasicInput from '../shared/BasicInput'
import { PlayersList } from '../../components/Player'
import { LeaguePointsSettingsList } from '../../components/League'

interface LeagueState {
    leagueName: string
    endDate: string
    playerName: string
    players: string[]
    // players: Player[]
    pointType: string
    pointsSettings: string[]
    // pointsSettings: PointSetting[],
    // dateInputFocused: boolean,
}

interface PreSubmitValidation {
    pointType: boolean
    playerName: boolean
}

// TODO: add Enter event listeners for add player and pointType?
export default function CreateLeague() {
    const [leagueState, setLeagueState] = useState<LeagueState>({
        leagueName: '',
        endDate: '',
        playerName: '',
        players: [],
        pointType: '',
        pointsSettings: [],
        // dateInputFocused: false,
    })
    const [showInputError, setShowInputError] = useState<PreSubmitValidation>({
        pointType: false,
        playerName: false,
    })

    function handleInputChange({ target }) {
        setLeagueState({ ...leagueState, [target.name]: target.value })
    }

    function handleSaveLeague(e) {
        e.preventDefault()
        console.log('save')
    }

    function deleteItemFromList(id, list) {
        console.log({ id, list })
        const filteredState = leagueState[list].filter((item) => item.id !== id)
        setLeagueState({
            ...leagueState,
            [list]: filteredState,
        })
    }

    function addInputItemToList(e) {
        console.log('e', e)
        console.log('e.key', e.key)
        e.preventDefault()
        const { inputItem, inputList } = e.target.dataset
        console.log('inputItem', inputItem)
        if (!leagueState[inputItem]) {
            setShowInputError({
                ...showInputError,
                [inputItem]: true,
            })
        } else {
            setShowInputError({
                ...showInputError,
                [inputItem]: false,
            })
            setLeagueState({
                ...leagueState,
                [inputList]: [
                    ...leagueState[inputList],
                    {
                        id: uuid(),
                        [inputItem]: leagueState[inputItem],
                    },
                ],
                // TODO: is it safe to clear input here? Safer to use previous leagueState?
                [inputItem]: '',
            })
        }
        console.log('leagueState: ', leagueState)
    }

    return (
        <div className="m-8 mx-auto max-w-screen-md">
            <h1 className="text-3xl font-bold">Create New League</h1>
            <BasicInput
                type="text"
                name="leagueName"
                label="League Name"
                onChange={handleInputChange}
                value={leagueState.leagueName}
                maxWidth="max-w-screen-sm"
                isRequired={true}
            />

            <BasicInput
                type="date"
                name="endDate"
                label="End Date"
                onChange={handleInputChange}
                value={leagueState.endDate}
                maxWidth="max-w-md"
                isRequired={true}
                // onFocus={onFocus}
                // onBlur={onBlur}
            />

            <h2 className="text-xl font-bold mt-4">Players</h2>
            <BasicInput
                type="text"
                name="playerName"
                label="Player Name"
                onChange={handleInputChange}
                value={leagueState.playerName}
                maxWidth="max-w-screen-sm"
                showEmptyInputError={showInputError.playerName}
            />

            <button
                data-input-item="playerName"
                data-input-list="players"
                onClick={addInputItemToList}
            >
                Add Player
            </button>

            <PlayersList
                listName="players"
                players={leagueState.players}
                deleteItemFromList={deleteItemFromList}
            />
            <h2 className="text-xl font-bold mt-4">Points Settings</h2>
            {/* TODO: Maybe put examples in a panel to free up some space? */}
            <p>
                Add points and then select the Settings button to assign point
                values (the value can be positive or negative), along with other
                setting options. Examples of types of points you can use: Eagle,
                Birdie, Par, Bogey, Double Bogey, Break a Rule, Cursing,
                Throw/Slam Club, you can get creative...
            </p>

            <BasicInput
                type="text"
                label="Point Name"
                name="pointType"
                onChange={handleInputChange}
                value={leagueState.pointType}
                maxWidth="max-w-screen-sm"
                showEmptyInputError={showInputError.pointType}
            />

            {/* TODO: Setup call to post point type and then forward point id to settings page */}
            {/* TODO: Setup Combobox to allow quick selection of commonly used types? https://ui.reach.tech/combobox */}
            <button
                data-input-item="pointType"
                data-input-list="pointsSettings"
                onClick={addInputItemToList}
            >
                Add Point
            </button>

            <LeaguePointsSettingsList
                listName="pointsSettings"
                pointSettings={leagueState.pointsSettings}
                deleteItemFromList={deleteItemFromList}
            />

            <div className="flex">
                {/* TODO: add validation to ensure league name has been added */}
                <button className="mx-auto" onSubmit={handleSaveLeague}>
                    Save League
                </button>
            </div>
        </div>
    )
}
