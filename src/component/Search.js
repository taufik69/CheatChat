import React from 'react'
import { TextField } from '@mui/material'
import { FcSearch } from 'react-icons/fc'
import { BsThreeDotsVertical } from 'react-icons/bs'
const Search = () => {
    return (
        <>
            <div className="inputbox1">
                <TextField className='searchbox'
                    helperText=" "
                    id="demo-helper-text-aligned-no-helper"
                    label="Search"
                />
                <FcSearch className='search-icon' />
                <BsThreeDotsVertical className='dots-iocn' />
            </div>

        </>


    )
}

export default Search