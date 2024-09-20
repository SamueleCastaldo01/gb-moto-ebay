import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // Per il messaggio di successo

export function DettagliPezzoDiRicambio({ nomePezzoDiRicambio, statoSel }) {
  const [categoria, setCategoria] = useState("");
  const [descrizioni, setDescrizioni] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Funzione per recuperare i dettagli del pezzo di ricambio
  const fetchDettagli = async () => {
    if (nomePezzoDiRicambio) {
      try {
        const q = query(
          collection(db, "pezzoDiRicambioTab"),
          where("nomePezzoDiRicambio", "==", nomePezzoDiRicambio)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0].data();
          setCategoria(doc.categoria || "");

          // Filtra le descrizioni in base allo stato
          const filteredDescrizioni = doc.descrizioni.filter(
            (item) => item.stato === statoSel
          );

          setDescrizioni(filteredDescrizioni);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli: ", error);
      }
    }
  };

  useEffect(() => {
    fetchDettagli();
  }, [nomePezzoDiRicambio, statoSel]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="detagli-pezzo mt-4" style={{ textAlign: "left" }}>
      <div>
      <div className="d-flex mb-2">
          <h5 style={{ margin: 0 }}>Categoria</h5>
          <img className="ms-1" style={{ width: "50px" }} src="logo-ebay.png" alt="eBay Logo" />
        </div>
        <div className="d-flex align-items-center">
          <p
            className="rounded-3 p-2 mb-0"
            style={{ border: "1px solid gray" }}
          >
            {categoria}
          </p>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={() => handleCopy({ categoria })}
            style={{ marginLeft: "10px" }}
          >
            Copia
          </Button>
        </div>

        <div className="mt-3">
        <div className="d-flex mb-2">
          <h5 style={{ margin: 0 }}>Descrizione </h5>
          <img className="ms-1" style={{ width: "50px" }} src="logo-ebay.png" alt="eBay Logo" />
        </div>
          {descrizioni.length > 0 ? (
            <>
              {descrizioni.map((desc, index) => (
                <div key={index} className="d-flex align-items-center">
                  <p
                    className="rounded-3 p-2 mb-0"
                    style={{ border: "1px solid gray" }}
                  >
                    {desc.descrizione}
                  </p>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopy(desc.descrizione)}
                    style={{ marginLeft: "10px" }}
                  >
                    Copia
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <p>Nessuna descrizione disponibile per questo stato.</p>
          )}
        </div>
      </div>

      {/* Snackbar per confermare che il testo è stato copiato */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Descrizione copiata negli appunti!
        </Alert>
      </Snackbar>
    </div>
  );
}
