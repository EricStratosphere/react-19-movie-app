import {useState, useEffect} from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies} from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method : 'GET',
    headers : {
        accept : 'application/json',
        Authorization : ('Bearer ' + API_KEY)
    }
}


const MovieApp = () =>{
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])
    //useDebounce works similarly to useEffect except that it delays the action that executes whenever a value changes. For instance, when searchTerm is altered, there is a 500 ms delay before setDebouncedSearchTerm is called in case searchTerm is called changed again. When searchTerm remains unchanged after 500 ms setDebouncedSearchTerm changes debouncedSearchTerm's value equal to the value of searchTerm, which in turn triggers the useEffect function conditioned to be called when debouncedSearchTerm changes its value. 

    const loadTrendingMovies = async() => {
        try{
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        }catch(error){
            console.error('Error fetching trending movies' + error);
    }
}


    const fetchMovies = async(query = '') => {
        setIsLoading(true);
        //We are setting isLoading to true before hand to start the countdown while making the API call.
        try {
            //this means that if the query is not an empty string then it executes the searchMovie API call
            
            //the encodeURI function takes the query string and converts it into an API readable format as an query parameter.
            const endpoint = query ? API_BASE_URL + '/search/movie?query=' + encodeURI(query): API_BASE_URL + '/discover/movie?sort_by=popularity.desc'
            const response = await fetch(endpoint, API_OPTIONS);
            //The API works :DDDD
            if(!response.ok)
                throw new Error('Failed to fetch movies');
            const data = await response.json();
            //Note that the .json function is a function that turns a json into a native JavaScript data type such as an object in this case.
            if(data.Response === 'False'){
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
            console.log(data);
        }
        //This first creates an asynchronous function
        catch(error){
            console.error('Error fetching movies: ' + error);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally{
            setIsLoading(false);
            //Sets it to false regardless of what happens
        }
    }

    useEffect( () => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);
    //A useEffect is a type of special hook function that is called either once when the page first renders or for every type the page updates and has to re-render.

    useEffect( () => {
        loadTrendingMovies();
    }, [])
    return(
        <main>
            <div className='pattern'>
                <div className='wrapper'>
                <header>
                    <img src="./hero-img.png" alt="Hero Banner" />
                    <h1> Find <span className='text-gradient '>Movies</span>  You'll Enjoy Without The Hastle</h1>
                    
                <Search searchTerm = {searchTerm} setSearchTerm={setSearchTerm}/>

            
                {trendingMovies.length > 0 && (
                    <section className='trending'>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map( (movie, index) => {
                                return (
                                    <li key={movie.$id}>
                                        {/*Keep in mind, when using the map function to create a dynamic list of components, having a unique key ensures that every new component returned has a unique key or a unique ID, that way they're each distinct from one another. */}
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title} /> 
                                    </li>
                                );
                            } )
                            }
                        </ul>
                    </section>
                )}

                <section className='all-movies text-white'>
                    <h2 className='mt-[40px]'>All Movies</h2>
                    {isLoading ? (<Spinner/>) : (errorMessage ? /*is the errorMessage not an empty string? */ (
                        <p className='text-red-500'> {errorMessage} </p>
                        ): 
                        (<ul>
                            {movieList.map((movie) => {
                                return (
                                    <MovieCard key={movie.id} movie={movie}/>
                                );
                            })}
                            {/* Basically what's happening here is a type of conditional rendering where it first displays a Loading text while the program is fetching the API, after the API call is finished it checks one more time if the call was successful or not, if it did fail, it displays the error message. Otherwise, it displays a list of the movies.*/}
                        </ul>)
                        )
                    }
                </section>
                </header>
                </div>
                <h1 className='text-white'>{searchTerm}</h1>
            </div>
        </main>
    );
}

export default MovieApp;

