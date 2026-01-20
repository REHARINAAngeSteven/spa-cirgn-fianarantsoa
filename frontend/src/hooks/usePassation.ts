// frontend/src/hooks/usePassation.ts
import { useState,useEffect } from "react";
import { militairesApi } from "../api/militaire.api";
import { passationApi } from "../api/passation.api";
import type { Militaire, Unite, Passation } from "../app/types/backend";
import { referentielsApi } from "../api/referentiels.api";

export interface PassationSPA extends Passation {
    passationInitier?: Passation;
}

export function usePassation() {
    const [militaires, setMilitaires] = useState<Militaire[]>([]);
    const [unites, setUnites] = useState<Unite[]>([]);
    const [passations, setPassation] = useState<PassationSPA[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const [militairesData,unitesData,passationDara] = await Promise.all([
                    militairesApi.getAll(),
                    referentielsApi.getAllUnites(),
                    passationApi.initier
                ])
            } catch (error) {
                
            }
        }
    })
}