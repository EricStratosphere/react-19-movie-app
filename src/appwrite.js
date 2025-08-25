import {Client, Databases, ID, Query} from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
 

//to avoid confusion, JSX means JavaScript XML, a syntax extension for JavaScript that allows Devs to write HTML like sytnax on JavaScript, normal JS files cannot do this.

const client = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    //1. Use Appwrite SDK to check if the searchTerm exists in the Database

    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm', searchTerm)])
        //database.listDocuments is a database query that fetches entries under the condition that query.equal
        if(result.documents.length > 0){
            const doc = result.documents[0];
            
            //2. if it does, update the count.
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count : doc.count + 1
            })
            //updates the count if it does exist already in the database.
        }else{
            //3. if it doesn't, add it to the database create a new document with the search term and set the count as 1.
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,

                count : 1,
                
                movie_id : movie.id,
                
                poster_url : 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
            })
        }
    } catch(error){

    }
}

export const getTrendingMovies = async() => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5), Query.orderDesc('count')])

        return result.documents;
    } catch(error) {

    }
}