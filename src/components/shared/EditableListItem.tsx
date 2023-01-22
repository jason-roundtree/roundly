import React from 'react'
import './EditableListItem.css'

interface EditableListItemProps {
    id: string
    text: string
    listName: string
    deleteItemFromList: (id, listName) => void
}

export default function EditableListItem({
    id,
    text,
    listName,
    deleteItemFromList,
}: EditableListItemProps): JSX.Element {
    return (
        <li
            key={id}
            className="max-w-fit rounded-lg my-1 mx-4 p-2 editable-list-item"
        >
            {text}
            <span>
                <button>Edit</button>
                <button onClick={() => deleteItemFromList(id, listName)}>
                    Delete
                </button>
            </span>
        </li>
    )
}
