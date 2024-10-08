import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Importa le funzioni di Firestore

export function InsPezzoDiRicambio(props) {
  const [nomePezzoDiRicambio, setNomePezzoDiRicambio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descrizioni, setDescrizioni] = useState([{ stato: "", descrizione: "" }]);
  const [paroleChiave, setParoleChiave] = useState([""]); // Stato per parole chiave
  const [errorMessage, setErrorMessage] = useState(null); // Stato per gestire gli errori

  // Funzione per gestire il cambiamento di stato o descrizione di un elemento
  const handleDescrizioneChange = (index, field, value) => {
    const newDescrizioni = [...descrizioni];
    newDescrizioni[index][field] = value.toUpperCase(); // Converti a uppercase
    setDescrizioni(newDescrizioni);
  };

  // Funzione per gestire il cambiamento delle parole chiave
  const handleParoleChiaveChange = (index, value) => {
    const newParoleChiave = [...paroleChiave];
    newParoleChiave[index] = value.toUpperCase(); // Converti a uppercase
    setParoleChiave(newParoleChiave);
  };

  // Aggiunge un nuovo campo per stato + descrizione
  const addDescrizione = () => {
    setDescrizioni([...descrizioni, { stato: "", descrizione: "" }]);
  };

  // Aggiunge una nuova parola chiave
  const addParolaChiave = () => {
    setParoleChiave([...paroleChiave, ""]);
  };

  // Rimuove una parola chiave specifica
  const removeParolaChiave = (index) => {
    const newParoleChiave = paroleChiave.filter((_, i) => i !== index);
    setParoleChiave(newParoleChiave);
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

  // Funzione per validare che tutti i campi 'stato' siano compilati
  const validateDescrizioni = () => {
    for (const descrizione of descrizioni) {
      if (!descrizione.stato.trim()) {
        return "Tutti i campi 'Stato' devono essere compilati.";
      }
    }
    return null;
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

    // Validazione - Stato obbligatorio per ogni descrizione
    const validationError = validateDescrizioni();
    if (validationError) {
      setErrorMessage(validationError);
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
        paroleChiave: paroleChiave.map(parola => parola.toUpperCase()), // Converti le parole chiave a uppercase
        descrizioni: descrizioni.map((item) => ({
          stato: item.stato.toUpperCase(), // Converti a uppercase
          descrizione: item.descrizione.toUpperCase(), // Converti a uppercase
        })),
      });

      // Reset dei campi dopo l'invio
      props.setNomePezzoRicambioSel(nomePezzoDiRicambio.toUpperCase())
      setNomePezzoDiRicambio("");
      setCategoria("");
      setDescrizioni([{ stato: "", descrizione: "" }]);
      setParoleChiave([""]); // Reset parole chiave
      props.onHide(); // Chiude il modal
      props.fetchPezziDiRicambio(); // Serve per aggiornare l'autocomplete
    } catch (error) {
      console.error("Errore durante l'invio dei dati a Firebase: ", error);
      setErrorMessage("Errore durante il salvataggio dei dati.");
    }
  };

  return (
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

          {/* Campo per il nome del pezzo di ricambio */}
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

          {/* Campo per le parole chiave */}
          <Form.Group className="mb-3">
            <Form.Label>Parole Chiave Titolo</Form.Label>
            <div className="scroll-chiave">
            {paroleChiave.map((parola, index) => (
              <Row key={index} className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    value={parola}
                    onChange={(e) => handleParoleChiaveChange(index, e.target.value)}
                    placeholder="Inserisci una parola chiave"
                  />
                </Col>
                <Col xs="auto" className="d-flex align-items-end">
                  {index > 0 && (
                    <Button
                      variant="danger"
                      onClick={() => removeParolaChiave(index)}
                    >
                      Rimuovi
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            </div>
            <Button variant="primary" onClick={addParolaChiave}>
              + Aggiungi Parola Chiave
            </Button>
          </Form.Group>

          {/* Campo per la categoria */}
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value.toUpperCase())} // Converti a uppercase
              placeholder="Inserisci la categoria"
            />
          </Form.Group>

          {/* Campo per le descrizioni */}
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
  );
}
