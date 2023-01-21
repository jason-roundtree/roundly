import { useState } from 'react'
import Input from '../shared/Input'
import { PointSetting } from '../../types'
import { PlayersList } from '../../components/Player'

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

export default function CreateLeague() {
    const [state, setState] = useState<LeagueState>({
        leagueName: '',
        endDate: '',
        playerName: '',
        players: [],
        pointType: '',
        pointsSettings: [],
        // dateInputFocused: false,
    })
    const [inputError, setInputError] = useState<PreSubmitValidation>({
        pointType: false,
        playerName: false,
    })

    function handleInputChange({ target }) {
        setState({ ...state, [target.name]: target.value })
    }

    function addInputItemToList(e) {
        e.preventDefault()
        const { inputItem, inputList } = e.target.dataset
        if (!state[inputItem]) {
            setInputError({
                ...inputError,
                [inputItem]: true,
            })
        } else {
            setInputError({
                ...inputError,
                [inputItem]: false,
            })
            setState({
                ...state,
                [inputList]: [...state[inputList], state[inputItem]],
                // TODO: is it safe to clear input here? Safer to use previous state?
                [inputItem]: '',
            })
        }
    }

    return (
        <form className="m-8 max-w-screen-md">
            <h1 className="text-3xl font-bold">Create New League</h1>
            <Input
                type="text"
                name="leagueName"
                label="League Name"
                onChange={handleInputChange}
                value={state.leagueName}
                maxWidth="max-w-screen-sm"
                isRequired={true}
            />
            <br />

            <Input
                // type={state.dateInputFocused || state.endDate ? "date" : "text"}
                type="date"
                name="endDate"
                label="End Date"
                onChange={handleInputChange}
                value={state.endDate}
                maxWidth="max-w-md"
                isRequired={true}
                // onFocus={onFocus}
                // onBlur={onBlur}
            />
            <br />

            <Input
                type="text"
                name="playerName"
                label="Player Name"
                onChange={handleInputChange}
                value={state.playerName}
                maxWidth="max-w-screen-sm"
                showEmptyInputError={inputError.playerName}
                // isRequired={true}
            />

            <button
                data-input-item="playerName"
                data-input-list="players"
                onClick={addInputItemToList}
                // disabled={state.playerName === ''}
            >
                Add Player
            </button>

            <PlayersList players={state.players} />

            {/* TODO: tell Prettier to format commented code? */}
            {/* <PlayerList 
                players={state.players}
                deletePlayer={deletePlayer}
            /> */}

            <h2 className="text-xl font-bold">Points Settings</h2>
            {/* TODO: Maybe put examples in a panel to free up some space? */}
            <p>
                Add points and then select the Settings button to assign point
                values (the value can be positive or negative), along with other
                setting options. Examples of types of points you can use: Eagle,
                Birdie, Par, Bogey, Double Bogey, Break a Rule, Cursing,
                Throw/Slam Club, you can get creative...
            </p>
            <br />

            <Input
                type="text"
                label="Point Name"
                name="pointType"
                onChange={handleInputChange}
                value={state.pointType}
                maxWidth="max-w-screen-sm"
                showEmptyInputError={inputError.pointType}
            />

            {/* TODO: Setup call to post point type and then forward point id to settings page */}
            {/* TODO: Setup Combobox to allow quick selection of commonly used types? https://ui.reach.tech/combobox */}
            <button
                data-input-item="pointType"
                data-input-list="pointsSettings"
                onClick={addInputItemToList}
                // disabled={state.pointType === ''}
            >
                Add Point
            </button>

            {/* <PointSettingsList 
                    pointSettings={state.pointSettings} 
                    deletePoint={deletePointSetting}
                /> */}

            <div className="flex">
                {/* TODO: add validation to ensure league name has been added */}
                <button
                    className="mx-auto"
                    // onSubmit={null}
                >
                    Save League
                </button>
            </div>
        </form>
    )
}
