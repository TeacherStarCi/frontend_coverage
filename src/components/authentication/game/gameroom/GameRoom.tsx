import React from "react"
import { ApplicationContext } from "../../../../App"
import { getNumberOfPlayers, getPlayerCurrentPositionInRoom } from "../../../../utils";
import { PlayerResult } from "./PlayerResult"


interface GameRoomProps {
}

export const GameRoom = (props: GameRoomProps) => {
    const [yourAddress, setYourAddress] = React.useState('');
    const [otherAddresses, setOtherAddresses] = React.useState<string[]>([]);
    const context = React.useContext(ApplicationContext);
    React.useEffect(() => {
        const assignOtherAddressess: string[] = [];
        if (context == null) return;
        if (context.getter.roomSet == null
            || context.getter.room == null
            || context.getter.userWithBalance == null) return;
        const numberOfPlayers = getNumberOfPlayers(context.getter.room.code, context.getter.roomSet);
        if (numberOfPlayers < 0) return;
        setYourAddress(context.getter.userWithBalance.user.address);
        if (numberOfPlayers < 2) return;
        const playerIndex = getPlayerCurrentPositionInRoom(context.getter.userWithBalance.user.address, context.getter.roomSet)
        for (let i = 0; i < numberOfPlayers; i++){
           if (i !== playerIndex){
            assignOtherAddressess.push(context.getter.room.players[i].socketUser.user.address)
           }
        }
        setOtherAddresses(assignOtherAddressess);
    }, [context])

    const displayOpponents = (otherAddresses: string[]): JSX.Element => {
        const results: JSX.Element[] = [];
        otherAddresses.forEach((address: string) => {
            results.push(<PlayerResult {...{ address: address }}>
                </PlayerResult>)
        })
        return (<div className = 'DisplayOpponents'> {results} </div>)
    }
    return (
        <div className='GameRoom'>
            <h1> YOU </h1>
            <PlayerResult {...{ address: yourAddress }}>
            </PlayerResult>
            <h1> OPPONENT(S) </h1>
            {displayOpponents(otherAddresses)}
        </div>
    )
}