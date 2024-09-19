// ModelloInput.js
import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

function PezzoDiRicambioI({ pezziDiRicambio, setModalShow, setModalShowEdit, setNomePezzoRicambioSel, nomePezzoDiRicambioSel }) {
  const [pezzoDiRicambio, setPezzoDiRicambio] = useState("");

  const handleInputChange = (event, newInputValue) => {
    setPezzoDiRicambio(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  //--------------------------------------------------------------------------------

  return (
    <>
      <div className="d-flex" style={{ alignItems: "center" }}>
        {/* Autocomplete */}
        <Autocomplete
          freeSolo
          options={pezziDiRicambio} // Passiamo i modelli come opzioni
          value={nomePezzoDiRicambioSel}
          onChange={(event, newValue) => {
          setNomePezzoRicambioSel(newValue ? newValue.toUpperCase() : "")
          }  
          } // Aggiorna il valore selezionato in maiuscolo
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
            const filtered = options.filter((option) =>
              option.toLowerCase().includes(inputValueUpperCase.toLowerCase())
            );
            if (
              inputValueUpperCase &&
              !filtered.includes(inputValueUpperCase)
            ) {
              filtered.push(inputValueUpperCase);
            }
            return filtered;
          }}
        />

        {/* Pulsante Aggiungi */}
        <Button
          variant="contained"
          color="warning"
          style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
          onClick={() => {
            setModalShow(true);
          }}
        >
          Aggiungi
        </Button>

        {/* Pulsante Conferma */}
        {pezziDiRicambio.includes(pezzoDiRicambio.trim().toUpperCase()) && (
          <>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "20px" }}
              onClick={() => {setModalShowEdit(true)}}
            >
              Modifica
            </Button>
            <Button
              variant="contained"
              color="success"
              style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
            >
              Conferma
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default PezzoDiRicambioI;
