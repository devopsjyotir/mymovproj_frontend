import React from 'react'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {updateAllMovies} from '../actions'
import {AddMovie, GetMovieList, DeleteMovie} from '../services/MovieServices'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'
import '../styles/MovieCard.css'

const Movies = ({ user, authenticated }) => {

    let navigate = useNavigate()
const [needRefresh, setNeedRefresh] = useState([true])
const dispatch = useDispatch()
const allMoviesList = useSelector((state) => state.allMoviesList)
const [movieAddMode, setMovieAddMode] = useState(false)
const [formValues, setFormValues] = useState({
    title:'',
    year: '',
    image: '',
    rating: '',
    genre: '',
    description:''
})

const enableAddMovieMode = () => {
    setMovieAddMode(true)
}

const disableAddMovieMode = () => {
    setMovieAddMode(false)
}

const handleChange = (e) => {
    // console.log(formValues)
    setFormValues({...formValues, [e.target.id]: e.target.value})
}

const handleSubmit = async (e) => {
    e.preventDefault()
    try{
    let createdMovie = await AddMovie(formValues)
    disableAddMovieMode()
    setFormValues({
        title:'',
        year: '',
        image: '',
        rating: '',
        genre: '',
        description:''
    })
    setNeedRefresh(true);
} catch (error) {
    throw error
  }
}



useEffect(()=> {
    let getMoviesList = async () => {
        let data = await GetMovieList()
        dispatch(updateAllMovies(data))
        setNeedRefresh(false)
    }

    if (needRefresh) {
        getMoviesList()
    }
}, [needRefresh])

let addButtonRender = (
    <button>
        Add Movie
    </button>
)


if(formValues.title & formValues.year & formValues.image & formValues.rating & formValues.genre & formValues.description){
    addButtonRender = (
        <button type='submit'>
            Add Movie
        </button>
    )
}

let movieAddRender = (
    <button onClick={enableAddMovieMode}>
        Add Movie
    </button>
)


if(movieAddMode) {
    movieAddRender = (
        <form onSubmit={handleSubmit} className="course-form">
            <label>Title</label>
            <input
            onChange={handleChange}
            value={formValues.title}
            type='text'
            id="title"
            placeholder='Thor' 
            /> 

            <label>Year</label>
            <input
            onChange={handleChange}
            value={formValues.year}
            type="number" 
            placeholder='2001' 
            id='year'
            /> 

            <label>Movie Image</label>
            <input
            onChange={handleChange}
            value={formValues.image}
            type='text'
            id='image'
            /> 

            <label>Movie rating</label>
            <input
            onChange={handleChange}
            value={formValues.rating}
            type="number" 
            id='rating'
            /> 

            <label>Genre</label>
            <input
            onChange={handleChange}
            value={formValues.genre}
            type='text'
            id='genre'
            /> 

            <label>Movie Description</label>
            <input
            onChange={handleChange}
            value={formValues.description}
            type='text'
            placeholder='Very Boring Movie' 
            id='description'
            /> 

            {addButtonRender}
        </form>
    )
}


let movieListRender = (
    <div className='movies-grid'>
        {allMoviesList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
)





return (
      <div>
        <div className='add-movie-btn'>{movieAddRender}</div>
        <div>{movieListRender}</div>
    </div>
  )

}

export default Movies