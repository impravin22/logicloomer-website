// The page's fixed addresses, named once.
//
// This app is published under /in-short/. The map (home/) is the site's home
// page and the CV sits beside it, one level up. The app uses a HashRouter, so
// the document URL never goes deeper than /in-short/ and "../" stays the root.
export const CV_URL = "../Pravy_CV.pdf";
export const MAP_URL = "../";

export const EMAIL = "impravin22@gmail.com";
export const GITHUB_URL = "https://github.com/impravin22";
export const GITLAB_URL = "https://gitlab.com/impravin22";

// The phone number as the page writes it, and the same number as a link.
export const PHONE = "+886 958 605 515";
export const PHONE_URL = `tel:${PHONE.replace(/\s+/g, "")}`;
