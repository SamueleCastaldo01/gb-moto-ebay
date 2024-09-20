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
        let yearsExpanded = [];
        let startYear, endYear;
        let baseTitle = "";
        let intermYear= "";
        let finalTitle = "";
    
        //mi consente di mettere l'intervallo all'interno di un array
        if (annoProduzione) {
            // Rimuove il trattino e gestisce gli anni
            const yearParts = annoProduzione.split(' - ');
            startYear = parseInt(yearParts[0].trim(), 10);
            endYear = parseInt(yearParts[1].trim(), 10);
    
            if (!isNaN(startYear) && !isNaN(endYear)) {
                for (let year = startYear + 1; year < endYear; year++) {
                    yearsExpanded.push(year);
                }
                yearsExpanded = [startYear, ...yearsExpanded, endYear];
            }
        }
    
        if (statoSel && statoSel.startsWith('*')) {
            baseTitle = `${nomePezzoRicambioSel || ''} ${paroleChiave.join(" ")} ${nomeModello || ''} ${startYear} ${endYear} ${statoSel}`;
        } else {
            baseTitle = `${nomePezzoRicambioSel || ''} ${paroleChiave.join(" ")} ${nomeModello || ''} ${startYear} ${endYear}`;
        }
    
        let baseLength = baseTitle.length; // Rimuovere le parentesi
    
        if (baseLength < 80) {
            for (let index = 0; index < yearsExpanded.length; index++) {
                const year = yearsExpanded[index];
                const stringYear = year.toString();
                
                if (index !== 0 && index !== (yearsExpanded.length - 1)) {
                    if ((stringYear.length + 1 + intermYear.length + baseLength) <= (80 - stringYear.length)) {
                        intermYear += " " + year;
                    } else {
                        intermYear += " AL";
                        break;
                    }
                }
            }
        }
        console.log(intermYear)
    
        // Assicurati di restituire un titolo finale
        if (statoSel && statoSel.startsWith('*')) {
            finalTitle = `${nomePezzoRicambioSel || ''} ${paroleChiave.join(" ")} ${nomeModello || ''} ${startYear} ${intermYear} ${endYear} ${statoSel}`;
        } else {
            finalTitle = `${nomePezzoRicambioSel || ''} ${paroleChiave.join(" ")} ${nomeModello || ''} ${startYear} ${intermYear} ${endYear}`;
        }
    
        return finalTitle;
    };
  
    setTitolo(generateTitolo());
  }, [nomePezzoRicambioSel, paroleChiave, nomeModello, annoProduzione, statoSel]);


  //------------------------------------------------------------------
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
