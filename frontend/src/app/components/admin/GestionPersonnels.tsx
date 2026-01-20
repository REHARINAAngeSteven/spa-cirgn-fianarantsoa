import { useEffect, useState } from "react";
import { getMilitaires } from "../../../api/militaire.api";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";

type Militaire = {
  im: string;
  nom: string;
  prenom: string;
  cin: string;
  id_unite: number;
};

const GestionPersonnels = () => {
  const [militaires, setMilitaires] = useState<Militaire[]>([]);

  useEffect(() => {
    const fetchMilitaires = async () => {
      const data = await getMilitaires();
      setMilitaires(data);
    };
    fetchMilitaires();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Gestion du Personnel</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IM</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>CIN</TableHead>
            <TableHead>Unité</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {militaires.map((m) => (
            <TableRow key={m.im}>
              <TableCell>{m.im}</TableCell>
              <TableCell>{m.nom}</TableCell>
              <TableCell>{m.prenom}</TableCell>
              <TableCell>{m.cin}</TableCell>
              <TableCell>{m.id_unite}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GestionPersonnels;
