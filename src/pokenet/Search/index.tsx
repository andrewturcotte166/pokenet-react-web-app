import { useParams } from "react-router-dom";

function Search() {
    const { keyword } = useParams();
    return (
        <div className="p-4">
            <h1>{`Search results for "${keyword}":`}</h1>
            <h3>No results</h3>
        </div>
    );
}

export default Search;