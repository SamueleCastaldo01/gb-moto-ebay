import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // Per un messaggio di successo più stiloso

export function InserzioneTitoloSubito({
  nomePezzoRicambioSel,
  nomeModello,
  annoProduzione,
  statoSel
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
        console.error("Errore durante il recupero delle parole chiave: ", error);
      }
    }
  };

  useEffect(() => {
    fetchParoleChiave();
  }, [nomePezzoRicambioSel]);

  useEffect(() => {
    // Funzione per generare il titolo basato sui dati forniti
    const generateTitolo = () => {
        let startYear, endYear;
        let finalTitle = ''; // Cambiato a let
        let intChiave = ''; // Cambiato a let

        if (annoProduzione) {
            // Rimuove il trattino e gestisce gli anni
            const yearParts = annoProduzione.split(' - ');
            startYear = parseInt(yearParts[0].trim(), 10);
            endYear = parseInt(yearParts[1].trim(), 10);
        }

        let baseTitle = `${nomePezzoRicambioSel || ''} ${nomeModello} ${startYear || ''} ${endYear || ''}`.trim();

        // Aggiungi stato se presente
        if (statoSel && statoSel.startsWith('*')) {
            baseTitle += ` ${statoSel}`;
        }

        // Assicura che il titolo non superi i 50 caratteri
        if (baseTitle.length > 50) {
            finalTitle = baseTitle.slice(0, 50).trim(); // Truncamento diretto
            return finalTitle;
        }

        // Controlla se aggiungere le parole chiave
        if (baseTitle.length < 50) {
            let availableSpace = 50 - baseTitle.length; // Cambiato a let

            for (let i = 0; i < paroleChiave.length; i++) { // Corretto: i < paroleChiave.length
                if (paroleChiave[i].length <= availableSpace) {
                    intChiave += " " + paroleChiave[i];
                    availableSpace -= paroleChiave[i].length + 1; // Aggiorna lo spazio disponibile
                } else {
                    break;
                }
            }
        }

        finalTitle = `${nomePezzoRicambioSel || ''} ${intChiave} ${nomeModello} ${startYear || ''} ${endYear || ''}`.trim();
        
        if (statoSel && statoSel.startsWith('*')) {
            finalTitle += ` ${statoSel}`;
        }

        // Troncamento finale per assicurare che non superi i 50 caratteri
        finalTitle = finalTitle.slice(0, 50).trim();

        return finalTitle;
    };

    setTitolo(generateTitolo());
}, [nomePezzoRicambioSel, paroleChiave, annoProduzione, statoSel]);



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
    <div className="mt-2">
      <div>
        <div className="d-flex mb-2 align-items-center">
          <h5 style={{ margin: 0 }}>Titolo Inserzione</h5>
          <img className="ms-1" style={{ width: "80px" }} src="subito.png" alt="Subito Logo" />
        </div>

        <div className="d-flex align-items-top gap-1">
          <div>
            <p
              className="p-2 rounded-3"
              style={{ margin: 0, border: "1px solid gray" }}
            >
              {titolo}
            </p>
            <p className="text-end" style={{ margin: 0, fontSize: "14px" }}>
              <strong>Caratteri totali:</strong> {titolo.length}/<b>50</b>
            </p>
          </div>

          <Button
            variant="contained"
            
            style={{backgroundColor: "#F9423A"}}
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            Copia Titolo
          </Button>
        </div>
      </div>

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
