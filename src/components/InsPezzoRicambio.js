import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Importa le funzioni di Firestore

export function InsPezzoDiRicambio(props) {
  const [nomePezzoDiRicambio, setNomePezzoDiRicambio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrizioni, setDescrizioni] = useState([{ stato: "", descrizione: "" }]);
  const [errorMessage, setErrorMessage] = useState(null); // Stato per gestire gli errori

  // Funzione per gestire il cambiamento di stato o descrizione di un elemento
  const handleDescrizioneChange = (index, field, value) => {
    const newDescrizioni = [...descrizioni];
    newDescrizioni[index][field] = value.toUpperCase(); // Converti a uppercase
    setDescrizioni(newDescrizioni);
  };

  // Aggiunge un nuovo campo per stato + descrizione
  const addDescrizione = () => {
    setDescrizioni([...descrizioni, { stato: "", descrizione: "" }]);
  };

  // Rimuove un campo specifico
  const removeDescrizione = (index) => {
    const newDescrizioni = descrizioni.filter((_, i) => i !== index);
    setDescrizioni(newDescrizioni);
  };

  // Funzione per controllare se il nome esiste già su Firebase
  const checkDuplicate = async () => {
    const pezzoQuery = query(
      collection(db, "pezzoDiRicambioTab"),
      where("nomePezzoDiRicambio", "==", nomePezzoDiRicambio.toUpperCase()) // Uppercase per il controllo duplicato
    );
    const querySnapshot = await getDocs(pezzoQuery);
    return !querySnapshot.empty; // Se il risultato non è vuoto, esiste un duplicato
  };

  // Funzione per gestire l'invio dei dati a Firebase
  const handleSubmit = async () => {
    // Reset dell'errore
    setErrorMessage(null);

    // Validazione - Nome pezzo di ricambio obbligatorio
    if (!nomePezzoDiRicambio) {
      setErrorMessage("Il nome del pezzo di ricambio è obbligatorio.");
      return;
    }

    // Controllo duplicati
    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      setErrorMessage("Il nome del pezzo di ricambio esiste già.");
      return;
    }

    // Se non ci sono errori, inviamo i dati
    try {
      await addDoc(collection(db, "pezzoDiRicambioTab"), {
        nomePezzoDiRicambio: nomePezzoDiRicambio.toUpperCase(), // Converti a uppercase
        categoria: categoria.toUpperCase(), // Converti a uppercase
        descrizioni: descrizioni.map((item) => ({
          stato: item.stato.toUpperCase(), // Converti a uppercase
          descrizione: item.descrizione.toUpperCase(), // Converti a uppercase
        })),
      });

      // Reset dei campi dopo l'invio
      setNomePezzoDiRicambio("");
      setCategoria("");
      setDescrizioni([{ stato: "", descrizione: "" }]);
      props.onHide(); // Chiude il modal
    } catch (error) {
      console.error("Errore durante l'invio dei dati a Firebase: ", error);
      setErrorMessage("Errore durante il salvataggio dei dati.");
    }
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Inserisci Pezzo di Ricambio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {errorMessage && (
              <Alert variant="danger">
                {errorMessage}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Nome Pezzo di Ricambio</Form.Label>
              <Form.Control
                type="text"
                value={nomePezzoDiRicambio}
                onChange={(e) => setNomePezzoDiRicambio(e.target.value.toUpperCase())} // Converti a uppercase
                placeholder="Inserisci il nome del pezzo di ricambio"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value.toUpperCase())} // Converti a uppercase
                placeholder="Inserisci la categoria"
              />
            </Form.Group>

            <div className="scroll-container">
              {descrizioni.map((descrizioneItem, index) => (
                <Row key={index} className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Stato</Form.Label>
                      <Form.Control
                        type="text"
                        value={descrizioneItem.stato}
                        onChange={(e) =>
                          handleDescrizioneChange(index, "stato", e.target.value)
                        }
                        placeholder="Inserisci lo stato (es: ottimo, decente, difetto)"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Descrizione</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={descrizioneItem.descrizione}
                        onChange={(e) =>
                          handleDescrizioneChange(index, "descrizione", e.target.value)
                        }
                        placeholder="Inserisci la descrizione"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="auto" className="d-flex align-items-end">
                    {index > 0 && (
                      <Button
                        variant="danger"
                        onClick={() => removeDescrizione(index)}
                      >
                        Rimuovi
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
            </div>

            <Button variant="primary" onClick={addDescrizione}>
              + Aggiungi Stato e Descrizione
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
