import React from 'react'

const person = {
    name : 'Bruce Wayne',
    age : 36,
    location : 'Gotham City'
}

const Search = (prop) => {
    return(
         <div className='search'>

            <div>
                <img src='../../public/search.png' alt="search" />

                <input type="text" 
                placeholder='Seach through thousands of movies' 
                value={prop.searchTerm}
                onChange={(e)=> prop.setSearchTerm(e.target.value)}
                />
            </div>
         </div>
    ); 
}

export default Search;