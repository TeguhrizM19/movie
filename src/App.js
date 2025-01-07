import { Button, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import { listMovie, searchMovie } from "./api";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");

  useEffect(() => {
    listMovie().then((result) => {
      setAllMovies(result);
      setPopularMovies(result.slice(0, 10));
      setTotalPages(Math.ceil(result.length / 10));
    });
  }, []);

  // Card
  const popularListMovie = () => {
    return popularMovies.map((movie) => (
      <Col key={movie.id} className="d-flex justify-content-center">
        <Card style={{ width: "220px" }} className="shadow mb-4">
          <Card.Img variant="top" src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} className="img-fluid" />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>{movie.release_date}</Card.Text>
            <Card.Text>Rating ⭐ {movie.vote_average}</Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Search
  const search = async (s, page = 1) => {
    if (s.length > 3) {
      setCurrentSearch(s); // Simpan nilai pencarian saat ini
      const query = await searchMovie(s, page);
      setPopularMovies(query.results);
      setTotalPages(query.total_pages);
      setCurrentPage(page);
    }
  };

  // console.log(popularMovies);

  const handlePageChange = (newPage) => {
    const startIndex = (newPage - 1) * 10;
    const endIndex = startIndex + 10;
    setPopularMovies(allMovies.slice(startIndex, endIndex));
    setCurrentPage(newPage);
    search(currentSearch, newPage);
  };

  const pagination = () => {
    return (
      <Col className="d-flex justify-content-end">
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </Col>
    );
  };

  return (
    <>
      <Container className="p-5">
        <Row className="text-center">
          <Col>
            <h1 className="text-black">Movies</h1>
          </Col>
        </Row>
        <Row className="justify-content-center my-3">
          <Col md={6}>
            <Form.Control onChange={({ target }) => search(target.value)} type="text" autoFocus placeholder="Search Movie..." className="border-secondary shadow search-input" />
          </Col>
        </Row>

        {/* Pagination Top */}
        <Row>{pagination()}</Row>

        {/* Card */}
        <Row className="pt-4">{popularListMovie()}</Row>

        {/* Pagination Bottom */}
        <Row>{pagination()}</Row>
      </Container>
    </>
  );
}

export default App;
