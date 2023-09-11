import { ClassValue, clsx } from "clsx";
import { matchPath } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Member {
  id: number;
  email: string;
  email_verified_at: string;
  firstname: string;
  lastname: string;
  role: string;
  avatar_filename: string;
  created_at: string;
  updated_at: string;
  laravel_through_key: number;
}

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

export const convertDateFromDateType = (date: Date) => {
  const dateArray = date.toString().split(" ");
  const month = dateArray[1];
  const day = dateArray[2];
  const year = dateArray[3];
  const newDate = `${year}-${month}-${day}`;
  return newDate;
};

export const convertDate = (date: string) => {
  const dateArray = date.split("-");
  const day = dateArray[2];
  const month = dateArray[1];
  const year = dateArray[0];
  return day + "/" + month + "/" + year;
};

export const convertTime = (time: string) => {
  //Convert time in a format like 00:00:00 to js Date object
  const timeArray = time.split(":");
  const hour = parseInt(timeArray[0]);
  const minute = parseInt(timeArray[1]);
  const second = parseInt(timeArray[2]);

  return new Date(0, 0, 0, hour, minute, second);
};

export const selectRoleDisplay = (role: string) => {
  switch (role) {
    case "cursus_director":
      return "Cursus Director";
      break;
    case "project_manager":
      return "Project Manager";
      break;
    case "professor":
      return "Professor";
      break;
    case "video_team":
      return "Video Team";
      break;
    case "video_editor":
      return "Video Editor";
    case "transcription_team":
      return "Transcription Team";
      break;
    case "traduction_team":
      return "Traduction Team";
      break;
    case "editorial_team":
      return "Editorial Team";
      break;
    default:
      return "Visitor";
      break;
  }
};

export const getInitials = (lastname?: string, firstname?: string) => {
  if (!lastname && firstname)
    return firstname[0].toUpperCase() + firstname[1].toLowerCase();

  if (lastname && !firstname)
    return lastname[0].toUpperCase() + lastname[1].toLowerCase();

  if (!lastname || !firstname) return "";

  return lastname[0].toUpperCase() + "." + firstname[0].toUpperCase();
};

export const formatName = (lastname?: string, firstname?: string) => {
  if (!lastname || !firstname) return "";

  if (lastname.length === 0 || firstname.length === 0) return "";

  return (
    capitalizeFirstLetter(lastname) + " " + capitalizeFirstLetter(firstname)
  );
};

export const teamChecker = (team: Member[]) => {
  //we need to check if the project has at least one of each possible roles
  const mandatoryRoles = [
    "project_manager",
    "professor",
    "video_team",
    "video_editor",
    "transcription_team",
    "traduction_team",
    "editorial_team",
  ];

  const teamRoles = team.map((member) => member.role);
  const teamHasAllRoles = mandatoryRoles.every((role) =>
    teamRoles.includes(role)
  );

  return teamHasAllRoles;
};

export const stepLinkExtractor = (step: number) => {
  switch (step) {
    case 1:
      return "prepare";
      break;
    case 2:
      return "capture";
      break;
    case 3:
      return "editing";
      break;
    case 4:
      return "transcription";
      break;
    case 5:
      return "traduction";
      break;
    case 6:
      return "edito";
      break;
    default:
      return "prepare";
      break;
  }
};

export const videoTimeSerializer = (seconds: number) => {
  //get rid of the decimal part
  seconds = Math.floor(seconds);

  //return the time as HH:MM:SS
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const sec = seconds - hours * 3600 - minutes * 60;

  const hoursStr = hours < 10 ? "0" + hours : hours;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secStr = sec < 10 ? "0" + sec : sec;

  return `${hoursStr}:${minutesStr}:${secStr}`;
};

export const videoTimeDeserializer = (time: string) => {
  //return the time in seconds
  const timeArray = time.split(":");
  const hours = parseInt(timeArray[0]);
  const minutes = parseInt(timeArray[1]);
  const seconds = parseInt(timeArray[2]);

  return hours * 3600 + minutes * 60 + seconds;
};

export const checkLastSeenProject = (
  pathName: string,
  lastSeenProjectId: string
) => {
  let isLastSeen = false;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}`))
    isLastSeen = true;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/prepare`))
    isLastSeen = true;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/capture`))
    isLastSeen = true;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/editing`))
    isLastSeen = true;

  if (
    matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/transcript`)
  )
    isLastSeen = true;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/subs`))
    isLastSeen = true;

  if (matchPath(pathName, `/dashboard/projects/${lastSeenProjectId}/edito`))
    isLastSeen = true;

  return isLastSeen;
};
