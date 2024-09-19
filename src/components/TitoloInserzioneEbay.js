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
      let yearsExpanded = [];
      let startYear, endYear;

      if (annoProduzione) {
        // Rimuove il trattino e gestisce gli anni
        const yearParts = annoProduzione.split(' - ');
        startYear = parseInt(yearParts[0].trim(), 10);
        endYear = parseInt(yearParts[1].trim(), 10);

        if (!isNaN(startYear) && !isNaN(endYear)) {
          // Aggiunge gli anni intermedi
          for (let year = startYear + 1; year < endYear; year++) {
            yearsExpanded.push(year);
          }
          
          // Se ci sono anni intermedi, aggiungi l'anno finale solo una volta
          if (yearsExpanded.length > 0) {
            yearsExpanded = [startYear, ...yearsExpanded, endYear];
          } else {
            yearsExpanded = [startYear, endYear];
          }
        }
      }

      // Funzione per formattare l'array di anni come stringa
      const formatYears = (yearsArr) => {
        if (yearsArr.length === 2) {
          return `${yearsArr[0]} AL ${yearsArr[1]}`;
        } else if (yearsArr.length > 2) {
          // Mostra tutti gli anni intermedi con "AL" solo se ci sono anni da aggiungere
          return `${yearsArr.slice(0, -1).join(' ')} AL ${yearsArr[yearsArr.length - 1]}`;
        }
        return yearsArr.join(' ');
      };

      // Crea il titolo base
      let baseTitle = `${nomePezzoRicambioSel} ${paroleChiave.join(" ")} ${nomeModello}`;
      let yearString = formatYears(yearsExpanded);
      
      // Aggiungi "ANNO" se c'è spazio sufficiente
      if (baseTitle.length + 5 + yearString.length <= 80) {
        baseTitle = `${baseTitle} ANNO`;
      }

      // Aggiungi gli anni formattati
      let finalTitle = `${baseTitle} ${yearString}`.trim();

      // Limita la lunghezza a 80 caratteri
      if (finalTitle.length > 80) {
        finalTitle = finalTitle.slice(0, 80); // Tronca il titolo a 80 caratteri
      }

      return finalTitle;
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
          <img className="ms-1" style={{ width: "50px" }} src="logo-ebay.png" alt="eBay Logo" />
        </div>

        <div className="d-flex align-items-center gap-1">
          <div>
            <p
              className="p-2 rounded-3"
              style={{ margin: 0, border: "1px solid gray", width: "calc(100% - 150px)" }} // Aggiunto un width per il contenitore del titolo
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
            style={{ height: 'fit-content' }} // Altezza del bottone
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
