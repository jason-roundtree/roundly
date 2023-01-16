import { useState } from 'react'
import Input from '../shared/Input'

export default function CreateLeague() {
    const [state, setState] = useState({
        leagueName: '',
        endDate: '',
        playerName: '',
        players: [],
        pointType: '',
        // pointSettings: [],
        // dateInputFocused: false,
    })
    function handleInputChange({ target }) {
        setState({ ...state, [target.name]: target.value })
    }

    return (
        <form className="m-8">
            <h1>Create New League</h1>
            <Input
                type="text"
                name="leagueName"
                label="League Name"
                onChange={handleInputChange}
                value={state.leagueName}
            />
            <br />

            <Input
                // type={this.state.dateInputFocused || this.state.endDate ? "date" : "text"}
                type="date"
                name="endDate"
                label="End Date"
                onChange={handleInputChange}
                value={state.endDate}
                // onFocus={this.onFocus}
                // onBlur={this.onBlur}
            />
            <br />

            <Input
                type="text"
                name="playerName"
                label="Player Name"
                onChange={handleInputChange}
                value={state.playerName}
            />
            <br />

            <button
                type="button"
                // onClick={this.addPlayer}
                // disabled={this.state.playerName === ''}
            >
                Add Player
            </button>
            {/* <PlayerList 
                        players={this.state.players}
                        deletePlayer={this.deletePlayer}
                    /> */}

            <h2>Points Settings</h2>
            {/* TODO: Maybe put examples in a panel to free up some space? */}
            <p>
                Add points and then select the Settings button to assign point
                values (the value can be positive or negative), along with other
                setting options. Examples of types of points you can use: Eagle,
                Birdie, Par, Bogey, Double Bogey, Break a Rule, Cursing,
                Throw/Slam Club, you can get creative...
            </p>

            <Input
                type="text"
                label="Point Name"
                name="pointType"
                onChange={handleInputChange}
                value={state.pointType}
            />
            <br />
            {/* TODO: Setup call to post point type and then forward point id to settings page */}
            {/* TODO: Setup Combobox to allow quick selection of commonly used types? https://ui.reach.tech/combobox */}
            <button
            // onClick={this.addPointSetting}
            // disabled={this.state.pointType === ''}
            >
                Add Point
            </button>

            {/* <PointSettingsList 
                        pointSettings={this.state.pointSettings} 
                        deletePoint={this.deletePointSetting}
                    /> */}
            <br />

            {/* TODO: add validation to ensure league name has been added */}
            <button
            // onSubmit={null}
            >
                Save League
            </button>
        </form>
    )
}
