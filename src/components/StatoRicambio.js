// StatoRicambio.js
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { query, collection, where, getDocs } from "firebase/firestore"; // Funzioni per leggere documenti

export function StatoRicambio({ nomePezzoDiRicambioSel }) {
  const [stati, setStati] = useState([]); // Stato per memorizzare gli stati
  const [loading, setLoading] = useState(true); // Stato per indicare il caricamento dei dati

  useEffect(() => {
    const fetchStati = async () => {
      if (!nomePezzoDiRicambioSel) return; // Non fare nulla se non è selezionato un pezzo di ricambio

      try {
        // Query per trovare il documento basato sul nome del pezzo di ricambio
        const pezzoQuery = query(
          collection(db, "pezzoDiRicambioTab"),
          where("nomePezzoDiRicambio", "==", nomePezzoDiRicambioSel)
        );
        const querySnapshot = await getDocs(pezzoQuery);

        if (!querySnapshot.empty) {
          // Supponiamo che il nome del pezzo sia unico e prendiamo il primo documento trovato
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          // Estrai e filtra gli stati unici
          setStati(data.descrizioni.map((d) => d.stato).filter((value, index, self) => self.indexOf(value) === index));
        } else {
          console.log("Documento non trovato.");
        }
      } catch (error) {
        console.error("Errore durante il recupero degli stati: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStati();
  }, [nomePezzoDiRicambioSel]);

  return (
    <>
      {!loading && stati.length > 0 && (
        <Autocomplete
          freeSolo
          options={stati} // Passiamo gli stati come opzioni
          renderInput={(params) => (
            <TextField
              {...params}
              label="Stato Pezzo di Ricambio"
              variant="outlined"
              style={{ width: "300px" }}
            />
          )}
        />
      )}
    </>
  );
}
