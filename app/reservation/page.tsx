import type { Metadata } from "next";
import Process from "@/components/sections/Process";

export const metadata: Metadata = {
  title: "Réservation | LN Touch",
  description: "Réservez votre séance de coiffure chez LN Touch. Box Braids, Knotless Braids, Fulani Braids et plus encore.",
  openGraph: {
    title: "Réservation LN Touch",
    description: "Réservez votre séance de coiffure en ligne.",
    type: "website",
    locale: "fr_FR",
    siteName: "LN Touch",
  },
  alternates: {
    canonical: "/reservation",
  },
};

const App = () =>{
    return(
        <Process/>
    )
}
export default App;