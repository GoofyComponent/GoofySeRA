import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const phoneRegex = new RegExp(
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
);

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (timestamp: string) => {
  const dateHeure = new Date(timestamp);
  const moisEnLettres = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const jour = dateHeure.getDate();
  const mois = moisEnLettres[dateHeure.getMonth()];
  const annee = dateHeure.getFullYear();
  const heure = ("0" + dateHeure.getHours()).slice(-2);
  const minute = ("0" + dateHeure.getMinutes()).slice(-2);

  const dateFormatee = `${jour} ${mois} ${annee} - ${heure}:${minute}`;
  return dateFormatee;
};
