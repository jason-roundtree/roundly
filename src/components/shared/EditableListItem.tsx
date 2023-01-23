// import { useState } from 'react'
// import './EditableListItem.css'

// interface EditableListItemProps {
//     id: string
//     text: string
//     pointValue: number
//     statePointValue: number
//     listName: string
//     deleteItemFromList: (id, listName) => void
//     // editListItem: (id, listName) => void
//     handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
// }

// export default function EditableListItem({
//     id,
//     text,
//     pointValue,
//     listName,
//     deleteItemFromList,
//     // editListItem,
//     // handleInputChange,
//     statePointValue,
// }: EditableListItemProps): JSX.Element {
//     const [isBeingEdited, setIsBeingEdited] = useState(false)
//     const [editableLeagueState, setEditableLeagueState] = useState({
//         text: '',
//         pointValue: pointValue,
//     })
//     console.log('editableLeagueState:: ', editableLeagueState)
//     function handleInputChange({
//         target: { name, value },
//     }: React.ChangeEvent<HTMLInputElement>): void {
//         setEditableLeagueState({ ...editableLeagueState, [name]: value })
//     }

//     return (
//         <li className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item">
//             <>
//                 <span className="editableListText">{text}</span>
//                 {listName === 'pointsSettings' && (
//                     <span className="editableListPointValue">
//                         {isBeingEdited ? (
//                             <input
//                                 type="number"
//                                 name="pointValue"
//                                 value={editableLeagueState.pointValue}
//                                 onChange={handleInputChange}
//                                 // onChange={() => editListItem(id, listName)}
//                             />
//                         ) : (
//                             pointValue
//                         )}
//                     </span>
//                 )}
//                 <span>
//                     {!isBeingEdited && (
//                         <button
//                             onClick={() => setIsBeingEdited(!isBeingEdited)}
//                         >
//                             Edit
//                         </button>
//                     )}
//                     {isBeingEdited && (
//                         <button onClick={() => editListItem(id, listName, )}>Save</button>
//                     )}
//                     <button onClick={() => deleteItemFromList(id, listName)}>
//                         Delete
//                     </button>
//                 </span>
//             </>
//         </li>
//     )
// }
