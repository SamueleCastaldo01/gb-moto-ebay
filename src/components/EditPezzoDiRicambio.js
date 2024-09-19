import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { doc, updateDoc } from "firebase/firestore"; // Funzioni per aggiornare il documento

export function EditPezzoDiRicambio({ pezzo, show, onHide }) {
  // Inizializzo gli stati con i dati esistenti del pezzo
  const [categoria, setCategoria] = useState(pezzo.categoria || "");
  const [descrizioni, setDescrizioni] = useState(pezzo.descrizioni || [{ stato: "", descrizione: "" }]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Funzione per gestire il cambiamento di stato o descrizione di un elemento
  const handleDescrizioneChange = (index, field, value) => {
    const newDescrizioni = [...descrizioni];
    newDescrizioni[index][field] = value;
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

  // Funzione per gestire l'aggiornamento dei dati su Firebase
  const handleUpdate = async () => {
    setErrorMessage(null);

    // Validazione - categoria obbligatoria (se serve)
    if (!categoria) {
      setErrorMessage("La categoria è obbligatoria.");
      return;
    }

    // Se non ci sono errori, inviamo i dati aggiornati a Firebase
    try {
      const pezzoRef = doc(db, "pezzoDiRicambioTab", pezzo.id); // Riferimento al documento da aggiornare
      await updateDoc(pezzoRef, {
        categoria: categoria,
        descrizioni: descrizioni, // Aggiorniamo l'array di descrizioni
      });

      onHide(); // Chiude il modal dopo l'aggiornamento
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati su Firebase: ", error);
      setErrorMessage("Errore durante l'aggiornamento dei dati.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Pezzo di Ricambio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          
          {/* Campo non modificabile */}
          <Form.Group className="mb-3">
            <Form.Label>Nome Pezzo di Ricambio (non modificabile)</Form.Label>
            <Form.Control
              type="text"
              value={pezzo.nomePezzoDiRicambio}
              disabled // Rende il campo non modificabile
            />
          </Form.Group>

          {/* Campo modificabile Categoria */}
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Inserisci la categoria"
            />
          </Form.Group>

          {/* Stato e descrizione */}
          <div className="scroll-container" style={{ maxHeight: "200px", overflowY: "auto" }}>
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
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Salva Modifiche
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
