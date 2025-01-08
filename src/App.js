import { Button, Card, Col, Container, Form, ListGroup, Modal, Pagination, Row } from "react-bootstrap";
import { listMovie, detailMovie, searchMovie } from "./api";
import "./App.css";
import { useEffect, useState } from "react";
// import ListCard from "./components/ListCard";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);

  // Page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [currentSearch, setCurrentSearch] = useState([]);

  // Modal
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setLgShow(false);
  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    listMovie().then((result) => {
      setAllMovies(result);
      setPopularMovies(result.slice(0, 10));
      setTotalPages(Math.ceil(result.length / 10));
    });
  }, []);

  // List Movies
  const popularListMovie = () => {
    return popularMovies.map((movie) => (
      <Col key={movie.id} className="d-flex justify-content-center">
        <Card style={{ width: "220px" }} className="shadow mb-4">
          <Card.Img variant="top" src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`} className="img-fluid" />
          <Card.Body>
            <Card.Title>{movie.title}</Card.Title>
            <Card.Text>{movie.release_date}</Card.Text>
            <Card.Text>Rating ⭐ {movie.vote_average}</Card.Text>
            <Button onClick={() => handleDetailClick(movie.id)} variant="primary">
              Detail...
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Fungsi untuk mengambil detail movie
  const handleDetailClick = async (movieId) => {
    const detail = await detailMovie(movieId);
    setMovieDetail(detail); // Simpan detail movie ke state
    setLgShow(true); // Tampilkan modal
    // console.log(movieId);
  };

  // Detail Movie
  const popularDetailMovie = () => {
    if (!movieDetail) return null;
    return (
      <Modal size="lg" centered show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">{movieDetail.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <img src={`${process.env.REACT_APP_BASEIMGURL}/${movieDetail.poster_path}`} alt="gambar" className="img-fluid" />
            </Col>
            <Col md>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Release Year : </strong>
                  {movieDetail.release_date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Genres : </strong>
                  {movieDetail.genres &&
                    movieDetail.genres.map((genre) => (
                      <span key={genre.id}>
                        {genre.name}
                        {", "}
                      </span>
                    ))}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Productions: </strong>
                  {movieDetail.production_companies &&
                    movieDetail.production_companies.map((produc) => (
                      <span key={produc.id}>
                        {produc.name}
                        {", "}
                      </span>
                    ))}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Rating : </strong>
                  {movieDetail.vote_average}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Overview : </strong>
                  {movieDetail.overview}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Search
  const search = async (s) => {
    if (s.length > 4) {
      setCurrentSearch(s); // Simpan nilai pencarian saat ini
      const results = await searchMovie(s);
      setAllMovies(results); // Simpan semua hasil pencarian
      setPopularMovies(results.slice(0, 10)); // Tampilkan hanya 10 hasil pertama
      setTotalPages(Math.ceil(results.length / 10)); // Hitung jumlah halaman
      setCurrentPage(1); // Reset halaman ke 1
    }
  };

  // console.log(popularMovies);

  // Page Pagination
  const handlePageChange = (newPage) => {
    const startIndex = (newPage - 1) * 10;
    const endIndex = startIndex + 10;
    setPopularMovies(allMovies.slice(startIndex, endIndex));
    setCurrentPage(newPage);
  };
  // Pagination
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
            <Form.Control onChange={({ target }) => search(target.value)} type="search" autoFocus placeholder="Search Movie..." className="border-secondary shadow search-input" />
          </Col>
        </Row>

        {/* Pagination Top */}
        <Row>{pagination()}</Row>

        {/* {ListCard()} */}

        {/* Card */}
        <Row className="pt-4">{popularListMovie()}</Row>

        {/* Modal Detail Movie */}
        {movieDetail && popularDetailMovie()}

        {/* Pagination Bottom */}
        <Row>{pagination()}</Row>
      </Container>
    </>
  );
}

export default App;
