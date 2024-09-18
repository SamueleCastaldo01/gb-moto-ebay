// ModelloInput.js
import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

function PezzoDiRicambioI({ annoProduzione, nomeModello, idModello, fetchAnnoProduzione }) {
  const [pezzoDiRicambio, setPezzoDiRicambio] = useState("");
  const [valoreSelezionato, setValoreSelezionato] = useState(""); // Per tenere traccia del valore selezionato

  const handleInputChange = (event, newInputValue) => {
    setPezzoDiRicambio(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  const isValidInput = () => {
    const pezzoDiRicambioUpperCase = pezzoDiRicambio.trim().toUpperCase();
    return pezzoDiRicambioUpperCase !== "" && !annoProduzione.includes(pezzoDiRicambioUpperCase);
  };


  //--------------------------------------------------------------------------------
  const handleAddAnnoProd = async () => {
    const pezzoDiRicambioUpperCase = pezzoDiRicambio.trim().toUpperCase();

    if (pezzoDiRicambioUpperCase !== "" && !annoProduzione.includes(pezzoDiRicambioUpperCase)) {
      try {
        const docRef = await addDoc(collection(db, "pezzoDiRicambioTab"), {
          pezzoDiRicambio: pezzoDiRicambioUpperCase,
          nomeModello: nomeModello,
          idModello: idModello,
        });
        console.log("Modello aggiunto con ID: ", docRef.id);

        fetchAnnoProduzione();
      } catch (e) {
        console.error("Errore durante l'aggiunta del modello: ", e);
      }
    } else {
      console.log("Nome modello vuoto, contiene solo spazi o già esistente.");
    }
  };

  return (
    <>
    <div className="d-flex" style={{ alignItems: "center" }}>
      {/* Autocomplete */}
      <Autocomplete
        freeSolo
        options={annoProduzione} // Passiamo i modelli come opzioni
        value={valoreSelezionato}
        onChange={(event, newValue) => setValoreSelezionato(newValue ? newValue.toUpperCase() : "")} // Aggiorna il valore selezionato in maiuscolo
        inputValue={pezzoDiRicambio}
        onInputChange={handleInputChange} // Aggiorna l'input mentre si digita e converte in maiuscolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Pezzo di ricambio"
            variant="outlined"
            style={{ width: "300px", textTransform: "uppercase" }} // Imposta il testo del TextField in maiuscolo
          />
        )}
        filterOptions={(options, params) => {
          const inputValueUpperCase = params.inputValue.trim().toUpperCase();
          const filtered = options.filter(option =>
            option.toLowerCase().includes(inputValueUpperCase.toLowerCase())
          );
          if (inputValueUpperCase && !filtered.includes(inputValueUpperCase)) {
            filtered.push(inputValueUpperCase);
          }
          return filtered;
        }}
      />

      {/* Pulsante Aggiungi */}
     
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
          onClick={() => {}}
        >
          Nuovo
        </Button>
    

      {/* Pulsante Conferma */}
      {annoProduzione.includes(pezzoDiRicambio.trim().toUpperCase()) && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
        >
          Conferma
        </Button>
      )}
    </div>
    </>
  );
}

export default PezzoDiRicambioI;
