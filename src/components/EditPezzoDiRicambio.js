import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col, Alert, Modal as BootstrapModal } from "react-bootstrap";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { doc, updateDoc, deleteDoc, query, where, getDocs, collection } from "firebase/firestore"; // Funzioni per aggiornare e cercare documenti

export function EditPezzoDiRicambio({ pezzo, show, onHide, fetchPezziDiRicambio, setPezzo, updateState, setUpdateState }) {
  const [categoria, setCategoria] = useState("");
  const [descrizioni, setDescrizioni] = useState([{ stato: "", descrizione: "" }]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pezzoId, setPezzoId] = useState(null); // Stato per memorizzare l'ID del pezzo
  const [confirmDelete, setConfirmDelete] = useState(false); // Stato per la conferma di eliminazione

  useEffect(() => {
    const fetchPezzoId = async () => {
      try {
        // Trova l'ID del pezzo usando il nome
        const pezzoQuery = query(
          collection(db, "pezzoDiRicambioTab"),
          where("nomePezzoDiRicambio", "==", pezzo)
        );
        const querySnapshot = await getDocs(pezzoQuery);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPezzoId(doc.id);
          // Carica i dati del pezzo
          setCategoria(doc.data().categoria || "");
          setDescrizioni(doc.data().descrizioni || [{ stato: "", descrizione: "" }]);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati del pezzo: ", error);
        setErrorMessage("Errore durante il recupero dei dati.");
      }
    };

    if (pezzo) {
      fetchPezzoId();
    }
  }, [pezzo]);

  // Funzione per gestire il cambiamento di stato o descrizione di un elemento
  const handleDescrizioneChange = (index, field, value) => {
    const newDescrizioni = [...descrizioni];
    newDescrizioni[index][field] = value.toUpperCase(); // Trasforma in uppercase
    setDescrizioni(newDescrizioni);
  };

  // Funzione per gestire il cambiamento della categoria
  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value.toUpperCase()); // Trasforma in uppercase
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

  // Funzione per validare che tutti i campi 'stato' siano compilati
  const validateDescrizioni = () => {
    for (const descrizione of descrizioni) {
      if (!descrizione.stato.trim()) {
        return "Tutti i campi 'Stato' devono essere compilati.";
      }
    }
    return null;
  };

  // Funzione per gestire l'aggiornamento dei dati su Firebase
  const handleUpdate = async () => {
    setErrorMessage(null);

    // Validazione - categoria obbligatoria
    if (!categoria) {
      setErrorMessage("La categoria è obbligatoria.");
      return;
    }

    // Validazione - stato obbligatorio per ogni descrizione
    const validationError = validateDescrizioni();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      const pezzoRef = doc(db, "pezzoDiRicambioTab", pezzoId); // Riferimento al documento da aggiornare
      await updateDoc(pezzoRef, {
        categoria: categoria,
        descrizioni: descrizioni.map(d => ({
          stato: d.stato.toUpperCase(),
          descrizione: d.descrizione.toUpperCase()
        })), // Aggiorniamo l'array di descrizioni
      });

      setUpdateState(updateState +1)
      onHide(); // Chiude il modal dopo l'aggiornamento
      fetchPezziDiRicambio(); // Aggiorna l'elenco dei pezzi di ricambio

      // Chiama la funzione di aggiornamento per aggiornare gli stati del ricambio


    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati su Firebase: ", error);
      setErrorMessage("Errore durante l'aggiornamento dei dati.");
    }
  };


  // Funzione per gestire l'eliminazione del pezzo di ricambio
  const handleDelete = async () => {
    setErrorMessage(null);

    // Conferma di eliminazione
    if (window.confirm("Sei sicuro di voler eliminare questo pezzo di ricambio?")) {
      try {
        const pezzoRef = doc(db, "pezzoDiRicambioTab", pezzoId); // Riferimento al documento da eliminare
        await deleteDoc(pezzoRef);

        setPezzo("");  //autocomplete in questo modo dovrebbe essere vuoto
        onHide(); // Chiude il modal dopo l'eliminazione
        fetchPezziDiRicambio()  //aggiorna l'autocomplete
      } catch (error) {
        console.error("Errore durante l'eliminazione dei dati su Firebase: ", error);
        setErrorMessage("Errore durante l'eliminazione dei dati.");
      }
    }
  };

  return (
    <>
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
                value={pezzo}
                disabled // Rende il campo non modificabile
              />
            </Form.Group>

            {/* Campo modificabile Categoria */}
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type="text"
                value={categoria}
                onChange={handleCategoriaChange}
                placeholder="Inserisci la categoria"
              />
            </Form.Group>

            {/* Stato e descrizione */}
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
          <Button variant="secondary" onClick={onHide}>
            Chiudi
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Elimina
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal di conferma eliminazione */}
      <BootstrapModal
        show={confirmDelete}
        onHide={() => setConfirmDelete(false)}
        centered
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Conferma Eliminazione</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          Sei sicuro di voler eliminare questo pezzo di ricambio? Questa azione non può essere annullata.
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Conferma Eliminazione
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}
