import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { StatoRicambio } from "./StatoRicambio";

function PezzoDiRicambioI({
  pezziDiRicambio,
  setModalShow,
  setModalShowEdit,
  setNomePezzoRicambioSel,
  nomePezzoDiRicambioSel,
  setStatoSel,
  statoSel,
  updateState
}) {
  const [pezzoDiRicambio, setPezzoDiRicambio] = useState("");

  const isOptionEqualToValue = (option, value) => {
    // Controllo che sia un valore valido e faccio un confronto case-insensitive
    return option?.toUpperCase() === value?.toUpperCase();
  };

  const handleInputChange = (event, newInputValue) => {
    setPezzoDiRicambio(newInputValue ? newInputValue.toUpperCase() : "");
  };

  const handleUpdateStati = () => {
    setNomePezzoRicambioSel(""); // Reset temporaneo
    setNomePezzoRicambioSel(nomePezzoDiRicambioSel); // Forza il refresh degli stati
  };

  return (
    <>
      <div className="d-flex" style={{ alignItems: "center" }}>
        {/* Autocomplete */}
        <Autocomplete
          freeSolo
          options={pezziDiRicambio}
          isOptionEqualToValue={isOptionEqualToValue}
          value={nomePezzoDiRicambioSel || ""} // Valore predefinito per evitare `null`
          onChange={(event, newValue) => {
            setNomePezzoRicambioSel(newValue ? newValue.toUpperCase() : "");
          }}
          inputValue={pezzoDiRicambio}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pezzo di ricambio"
              variant="outlined"
              style={{ width: "300px", textTransform: "uppercase" }}
            />
          )}
          filterOptions={(options, params) => {
            const inputValueUpperCase = params.inputValue.trim().toUpperCase();
            const filtered = options.filter((option) =>
              option.toLowerCase().includes(inputValueUpperCase.toLowerCase())
            );
            // Se l'input non è incluso nelle opzioni, lo aggiunge
            if (inputValueUpperCase && !filtered.includes(inputValueUpperCase)) {
              filtered.push(inputValueUpperCase);
            }
            return filtered;
          }}
        />

        {/* Pulsante Aggiungi */}
        <Button
          variant="contained"
          color="warning"
          style={{ marginLeft: "20px" }}
          onClick={() => {
            setModalShow(true);
          }}
        >
          Aggiungi
        </Button>

        {/* Pulsante Modifica e Conferma */}
        {pezziDiRicambio.includes(pezzoDiRicambio.trim().toUpperCase()) && (
          <>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: "20px" }}
              onClick={() => {
                setModalShowEdit(true);
              }}
            >
              Modifica
            </Button>
            <Button
              variant="contained"
              color="success"
              style={{ marginLeft: "20px" }}
            >
              Conferma
            </Button>
          </>
        )}
      </div>

      <div className=" d-flex align-content-start mt-3">
        {pezziDiRicambio.includes(pezzoDiRicambio.trim().toUpperCase()) && (
          <StatoRicambio
            nomePezzoDiRicambioSel={nomePezzoDiRicambioSel}
            statoSel={statoSel}
            setStatoSel={setStatoSel}
            onUpdate={handleUpdateStati}
            updateState={updateState}
          />
        )}
      </div>
    </>
  );
}

export default PezzoDiRicambioI;
