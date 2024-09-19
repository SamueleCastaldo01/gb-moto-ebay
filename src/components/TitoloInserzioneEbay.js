import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // Per un messaggio di successo più stiloso

export function TitoloInserzioneEbay({
  nomePezzoRicambioSel,
  nomeModello,
  annoProduzione,
}) {
  const [paroleChiave, setParoleChiave] = useState([]);
  const [titolo, setTitolo] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Stato per gestire la visualizzazione del messaggio

  // Recupera le parole chiave suggerite dal database in base al pezzo selezionato
  const fetchParoleChiave = async () => {
    if (nomePezzoRicambioSel) {
      try {
        const q = query(
          collection(db, "pezzoDiRicambioTab"),
          where("nomePezzoDiRicambio", "==", nomePezzoRicambioSel)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setParoleChiave(doc.data().paroleChiave || []);
        }
      } catch (error) {
        console.error(
          "Errore durante il recupero delle parole chiave: ",
          error
        );
      }
    }
  };

  useEffect(() => {
    fetchParoleChiave();
  }, [nomePezzoRicambioSel]);

  useEffect(() => {
    // Funzione per generare il titolo basato sui dati forniti
    const generateTitolo = () => {
      const baseTitle = `${nomePezzoRicambioSel} ${paroleChiave.join(
        " "
      )} ${nomeModello} ${annoProduzione}`.trim();

      // Limita la lunghezza a 80 caratteri
      if (baseTitle.length > 80) {
        return baseTitle.slice(0, 80); // Tronca il titolo a 80 caratteri
      }
      return baseTitle;
    };

    setTitolo(generateTitolo());
  }, [nomePezzoRicambioSel, paroleChiave, nomeModello, annoProduzione]);

  // Funzione per copiare il titolo negli appunti
  const handleCopy = () => {
    navigator.clipboard.writeText(titolo).then(() => {
      setSnackbarOpen(true); // Mostra il messaggio quando il titolo viene copiato
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Nascondi il messaggio dopo un po'
  };

  return (
    <div className="mt-5">
      <div>
        <div className="d-flex mb-2">
          <h5 style={{ margin: 0 }}>Titolo Inserzione </h5>
          <img className="ms-1" style={{ width: "50px" }} src="logo-ebay.png" />
        </div>

        <div className="d-flex align-items-center gap-1">
          <div>
            <p
              className="p-2 rounded-3"
              style={{ margin: 0, border: "1px solid gray" }}
            >
              {titolo}
            </p>
            <p className="text-end" style={{ margin: 0 }}>
              <strong>Caratteri totali:</strong> {titolo.length}/<b>80</b>
            </p>
          </div>

          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />} // Icona di copia
            onClick={handleCopy}
          >
            Copia Titolo
          </Button>
        </div>
      </div>

      {/* Bottone per copiare il titolo */}

      {/* Snackbar per confermare che il testo è stato copiato */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Durata della visualizzazione
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Posizione del messaggio
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Titolo copiato negli appunti!
        </Alert>
      </Snackbar>
    </div>
  );
}
