// lib/data.ts — Source unique de toutes les données LN Touch

// ─────────────────────────────────────────────────────────────────────────────
// 1. COIFFURES (Styles de coiffure)
// ─────────────────────────────────────────────────────────────────────────────

export interface Coiffure {
  slug: string;
  name: string;
  variant: string;
  tagline: string;
  description: string;
  technique: string;
  conseil: string;
  duration: string;
  hold: string;
  price: string;
  ideal: string;
  images: string[];
  accent: string;
  instagram: string;
  whatsapp: string;
  related: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const WA = "243856270030"; // WhatsApp LN Touch

export const COIFFURES: Coiffure[] = [
  {
    slug: "knotless-braids-medium",
    name: "Knotless Braids",
    variant: "Medium",
    tagline: "Légèreté totale. Zéro tension.",
    description:
      "Les Knotless Braids Medium sont la référence absolue en matière de tresses protectrices. Contrairement aux box braids traditionnelles, elles démarrent avec vos propres cheveux — sans nœud de base — pour une tension quasi nulle sur le cuir chevelu. Le résultat ? Des tresses naturelles, souples, qui tombent parfaitement.",
    technique:
      "La technique consiste à introduire progressivement le rajout au fil des centimètres, créant une tresse qui part fine à la racine et s'épaissit naturellement. Chaque tresse est scellée à l'eau chaude. La session dure entre 4 et 5 heures selon l'épaisseur de vos cheveux naturels.",
    conseil:
      "Hydratez vos tresses toutes les 2–3 nuits avec un spray eau + huile de jojoba légère. Dormez avec un bonnet en satin. Évitez de tirer sur les racines. Avec ce soin minimal, vos knotless medium tiennent 6 à 8 semaines sans problème.",
    duration: "4–5h",
    hold: "6–8 semaines",
    price: "À partir de 80€",
    ideal: "Toutes longueurs · Cheveux fragiles · Première fois en tresses",
    images: [
      "https://i.pinimg.com/736x/3a/ea/08/3aea08c292d74f36d103a31b2d89b5bd.jpg",
      "https://i.pinimg.com/736x/24/ab/b6/24abb660c0f0c370d8cc182bba900097.jpg",
      "https://i.pinimg.com/1200x/ab/17/31/ab17312bd02b5cb807d90a355f993255.jpg",
    ],
    accent: "#c9a97a",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["knotless-braids-large", "boho-braids-long", "fulani-braids"],
    seo: {
      title: "Knotless Braids Medium – Tresses sans nœud | LN Touch",
      description:
        "Knotless Braids Medium : tresses protectrices sans tension, naturelles et durables. Résultat en 4–5h dès 80€. Réservez chez LN Touch.",
      keywords: ["knotless braids medium", "tresses sans nœud", "tresses protectrices", "LN Touch"],
    },
  },
  {
    slug: "knotless-braids-large",
    name: "Knotless Braids",
    variant: "Large",
    tagline: "Bold. Rapide. Libre.",
    description:
      "La version large des Knotless pour celles qui veulent un look affirmé en un minimum de temps. Plus épaisses, plus volumineuses — elles habillent le visage avec caractère et s'adaptent à tous les styles. L'impact est immédiat.",
    technique:
      "Même technique sans nœud que la version medium, mais avec un rajout plus volumineux dès le départ. La session est nettement plus courte : 2 à 3h en chaise. Parfait si vous avez un agenda chargé et un événement imminent.",
    conseil:
      "Les knotless large étant plus volumineuses, elles retiennent un peu plus l'humidité. Séchez bien vos racines après le shampooing. Un spray léger à l'huile d'argan maintient la brillance tout au long de la durée de port.",
    duration: "2–3h",
    hold: "4–6 semaines",
    price: "À partir de 60€",
    ideal: "Looks bold · Gain de temps · Cheveux épais",
    images: [
      "https://i.pinimg.com/736x/6e/3c/d8/6e3cd81f1ecbbb4bfa958f2db15abbd6.jpg",
      "https://i.pinimg.com/736x/fa/72/3e/fa723e2db1b495891e201a4796015954.jpg",
      "https://i.pinimg.com/736x/6c/ea/88/6cea88444de9fd362b653950fd146f2e.jpg",
    ],
    accent: "#e8c4a0",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["knotless-braids-medium", "braided-ponytail", "fulani-braids"],
    seo: {
      title: "Knotless Braids Large – Tresses bold & rapides | LN Touch",
      description:
        "Knotless Braids Large : tresses épaisses, impact immédiat en 2–3h, dès 60€. Salon LN Touch.",
      keywords: ["knotless braids large", "tresses épaisses", "box braids", "LN Touch"],
    },
  },
  {
    slug: "boho-braids-short",
    name: "Boho Braids",
    variant: "Short",
    tagline: "Bohème. Libre. Sauvage.",
    description:
      "Les Boho Braids Short capturent l'essence du mouvement naturel. Entre chaque tresse s'échappent des boucles libres — une texture ondulée, vivante, qui mélange structure et liberté. La version short apporte une légèreté parfaite pour l'été ou les quotidiens actifs.",
    technique:
      "Les Boho Braids combinent tressage classique et insertion de mèches crochetées bouclées entre les sections. L'effet est immédiat : une coiffure qui semble avoir poussé naturellement, avec ce volume romantique si caractéristique. Durée : 3 à 4h.",
    conseil:
      "Les boucles se définissent mieux avec un peu d'humidité. Vaporisez une légère brume capillaire chaque matin. Évitez les produits lourds qui alourdissent les boucles. Un démêlage doux aux doigts suffit pour raviver le volume.",
    duration: "3–4h",
    hold: "5–7 semaines",
    price: "À partir de 70€",
    ideal: "Été · Style décontracté · Toutes longueurs",
    images: [
      "https://i.pinimg.com/1200x/a7/54/6d/a7546da8faf2c6da55ecc26f62959bf3.jpg",
      "https://i.pinimg.com/736x/8a/82/17/8a82174654a233483a7b6837b594ff35.jpg",
      "https://i.pinimg.com/736x/c5/6e/dc/c56edcbad0fb040b917135e9458f34ed.jpg",
    ],
    accent: "#b8956a",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["boho-braids-long", "knotless-braids-medium", "french-curl"],
    seo: {
      title: "Boho Braids Short – Tresses bohèmes légères | LN Touch",
      description:
        "Boho Braids Short : tresses avec boucles libres, style bohème naturel. Session 3–4h dès 70€. LN Touch.",
      keywords: ["boho braids", "tresses bohèmes", "tresses boucles", "LN Touch"],
    },
  },
  {
    slug: "boho-braids-long",
    name: "Boho Braids",
    variant: "Long",
    tagline: "Romantique. Envoûtant. Signature.",
    description:
      "Le boho long, c'est une identité à part entière. Les tresses tombent dans le dos, les boucles dansent à chaque mouvement — une coiffure qui parle avant même que vous ouvriez la bouche. Pour celles qui veulent une présence, une signature esthétique forte.",
    technique:
      "La longueur supplémentaire demande davantage de soin dans la pose : chaque tresse est alignée pour assurer une chute parfaite. Les boucles sont réparties pour un rendu aérien, non surchargé. Comptez 5 à 6h pour un résultat impeccable du front à la nuque.",
    conseil:
      "La longueur est précieuse — protégez les pointes en les hydratant régulièrement. Le nuit, une tresse lâche ou un bonnet satin évitent les frottements qui défrisent les boucles. Rafraîchissez avec de l'eau et un peu de gel léger pour régénérer les spirales.",
    duration: "5–6h",
    hold: "6–8 semaines",
    price: "À partir de 90€",
    ideal: "Occasions spéciales · Style signature · Longueur mid-back",
    images: [
      "https://i.pinimg.com/736x/09/99/40/099940b9fc9aac86a68c06507573ecfb.jpg",
      "https://i.pinimg.com/736x/d9/81/41/d98141af73f31615d10ec7b2cf8f3acd.jpg",
      "https://i.pinimg.com/736x/6a/bd/4b/6abd4b788e4fbe8b01e2227ea00ba007.jpg",
    ],
    accent: "#d4a882",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["boho-braids-short", "french-curl", "knotless-braids-medium"],
    seo: {
      title: "Boho Braids Long – Tresses longues romantiques | LN Touch",
      description:
        "Boho Braids Long : tresses longues avec boucles libres, style romantique et signature. Dès 90€. Salon LN Touch.",
      keywords: ["boho braids long", "tresses longues boucles", "tresses romantiques", "LN Touch"],
    },
  },
  {
    slug: "fulani-braids",
    name: "Fulani Braids",
    variant: "Tresses",
    tagline: "Héritage. Précision. Caractère.",
    description:
      "Les Fulani Braids sont un art ancestral originaire d'Afrique de l'Ouest. Reconnaissables à leur motif central, leurs tresses latérales et leurs accessoires discrets — perles, fils dorés — elles sont une déclaration culturelle autant qu'esthétique. Une coiffure qui porte une histoire.",
    technique:
      "La pose Fulani requiert une précision géométrique : le motif central est tressé en premier, puis les sections latérales sont structurées de part et d'autre du visage. Les accessoires (perles, anneaux) sont intégrés à la pose. Durée : 4 à 6h selon la complexité du motif.",
    conseil:
      "Les accessoires peuvent alourdir légèrement les tresses — renforcez les attaches si nécessaire. Un soin hydratant hebdomadaire sur le cuir chevelu maintient la santé de vos racines pendant la durée de port. Retirez les perles avant le shampooing.",
    duration: "4–6h",
    hold: "6–8 semaines",
    price: "À partir de 85€",
    ideal: "Style culturel · Occasions · Cheveux mi-longs à longs",
    images: [
      "https://i.pinimg.com/736x/f6/9f/37/f69f37c88d46fe254cdda930540bafa8.jpg",
      "/images/fulani_braids.png",
      "https://i.pinimg.com/736x/fe/c2/fb/fec2fb0e17cf2a0391b174a86840c51f.jpg",
    ],
    accent: "#c4a05a",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["fulani-crochet", "knotless-braids-medium", "braided-ponytail"],
    seo: {
      title: "Fulani Braids – Tresses africaines traditionnelles | LN Touch",
      description:
        "Fulani Braids : tresses africaines avec motif central et accessoires. Héritage et modernité. Dès 85€. LN Touch.",
      keywords: ["fulani braids", "tresses africaines", "tresses traditionnelles", "LN Touch"],
    },
  },
  {
    slug: "fulani-crochet",
    name: "Fulani Crochet",
    variant: "Crochets",
    tagline: "Rapide. Précis. Élégant.",
    description:
      "La technique crochet appliquée à l'esthétique Fulani — pour un rendu authentique en deux fois moins de temps. Idéale pour celles qui souhaitent le style Fulani sans la longue session en chaise. La modernité au service de la tradition, sans compromis sur le résultat.",
    technique:
      "Une base de cornrows est d'abord posée, sur laquelle les extensions Fulani sont accrochées au crochet. Le résultat imite parfaitement les Fulani Braids traditionnelles. La session ne dure que 2 à 3h — un vrai gain de temps pour un look identique.",
    conseil:
      "Comme pour toute coiffure crochet, vérifiez régulièrement l'état de vos cornrows de base. Un spray hydratant léger sur les extensions maintient la fraîcheur. Les Fulani crochet ont tendance à durer légèrement moins longtemps que les Fulani tressées — comptez 5 à 6 semaines.",
    duration: "2–3h",
    hold: "5–6 semaines",
    price: "À partir de 55€",
    ideal: "Gain de temps · Budget maîtrisé · Style Fulani accessible",
    images: [
      "https://i.pinimg.com/736x/cb/7c/89/cb7c89462e25b7301ee37cfff3a08471.jpg",
      "https://i.pinimg.com/1200x/84/2b/26/842b265ea779c50b1eb32535181ccd5f.jpg",
      "https://i.pinimg.com/1200x/69/2b/fe/692bfed58913e568972c6a3c2e7e2f5a.jpg",
    ],
    accent: "#d6b87a",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["fulani-braids", "knotless-braids-large", "braided-ponytail"],
    seo: {
      title: "Fulani Crochet – Style Fulani rapide & accessible | LN Touch",
      description:
        "Fulani Crochet : look Fulani en 2–3h dès 55€. Technique crochet sur cornrows. Salon LN Touch.",
      keywords: ["fulani crochet", "crochet braids", "tresses crochet", "LN Touch"],
    },
  },
  {
    slug: "braided-ponytail",
    name: "Braided Ponytail",
    variant: "Classic",
    tagline: "Structuré. Sophistiqué. Intemporel.",
    description:
      "La queue tressée est la définition de l'élégance pratique. Elle structure le visage, allonge la silhouette et s'adapte à tous les contextes — bureau, soirée, mariage. Une coiffure polyvalente qui ne sacrifie jamais l'esthétique pour le confort.",
    technique:
      "Les cheveux sont d'abord nattés en cornrows remontants vers le sommet, où une queue haute ou basse est formée. Des extensions peuvent être ajoutées pour plus de volume et de longueur. Le finishing lisse les bords avec un gel fixant pour un rendu impeccable. Durée : 2 à 3h.",
    conseil:
      "Les bords (edges) sont la partie la plus délicate — évitez les gels trop forts qui fragilisent les tempes à long terme. La nuit, attachez votre queue lâchement avec un scrunchie en satin. Un spray d'eau légère rafraîchit les cornrows le matin.",
    duration: "2–3h",
    hold: "3–5 semaines",
    price: "À partir de 50€",
    ideal: "Vie professionnelle · Mariages · Usage quotidien élégant",
    images: [
      "https://i.pinimg.com/736x/1b/6c/8e/1b6c8e9d5d8c2769bdba5218b3f37dc4.jpg",
      "https://i.pinimg.com/1200x/7b/a8/cd/7ba8cde352ce195f36aeba856939a7b5.jpg",
      "https://i.pinimg.com/736x/d7/db/e7/d7dbe7dd437643aec01dc1d21bc12f3f.jpg",
    ],
    accent: "#b09070",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["knotless-braids-medium", "fulani-braids", "knotless-braids-large"],
    seo: {
      title: "Braided Ponytail – Queue tressée élégante | LN Touch",
      description:
        "Braided Ponytail : queue de cheval tressée sophistiquée, idéale bureau ou soirée. Dès 50€. LN Touch.",
      keywords: ["braided ponytail", "queue tressée", "cornrows queue", "LN Touch"],
    },
  },
  {
    slug: "french-curl",
    name: "French Curl",
    variant: "Spirale",
    tagline: "Volumineux. Glamour. Parfait.",
    description:
      "La French Curl est la reine du volume. Ses boucles spirales généreuses créent une chevelure majestueuse, lumineuse, qui capte la lumière sous tous les angles. C'est la coiffure des grandes occasions — celle qui transforme l'entrée dans une pièce en moment mémorable.",
    technique:
      "Les extensions French Curl sont accrochées en crochet sur une base de cornrows. Chaque mèche est soigneusement positionnée pour assurer un volume homogène et des boucles bien définies. La session dure 3 à 5h selon le volume désiré et la longueur choisie.",
    conseil:
      "Les boucles French Curl sont sensibles à l'humidité excessive. Évitez les environnements très humides ou couvrez avec un foulard léger. Pour raviver les spirales aplaties, plongez brièvement dans de l'eau tiède. Dormez toujours avec un bonnet en satin pour préserver le volume.",
    duration: "3–5h",
    hold: "4–6 semaines",
    price: "À partir de 75€",
    ideal: "Mariages · Soirées · Événements · Séances photo",
    images: [
      "https://i.pinimg.com/736x/c0/8d/63/c08d63e1c157b00fc3d8cda0e9225b91.jpg",
      "https://i.pinimg.com/736x/58/50/a5/5850a5bd0407868b3f1a6cf4cf2660ea.jpg",
      "https://i.pinimg.com/736x/67/af/73/67af73577c8cd4f5a46b8821c2c12534.jpg",
    ],
    accent: "#c8a090",
    instagram: "https://www.instagram.com/lntouch12/",
    whatsapp: WA,
    related: ["boho-braids-long", "boho-braids-short", "fulani-braids"],
    seo: {
      title: "French Curl – Boucles spirales glamour | LN Touch",
      description:
        "French Curl : boucles spirales volumineuses, look glamour pour occasions spéciales. Dès 75€. Salon LN Touch.",
      keywords: ["french curl", "boucles spirales", "crochet curl", "LN Touch"],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. FAQ (Questions fréquentes)
// ─────────────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "réservation" | "paiement" | "organisation" | "services" | "qualité";
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "Comment réserver une séance ?",
    answer: "Nous fonctionnons uniquement sur rendez-vous. Vous pouvez réserver directement via notre formulaire en ligne (section Process) ou nous contacter par WhatsApp. Une confirmation vous sera envoyée sous 12h.",
    category: "réservation"
  },
  {
    id: 2,
    question: "Faut-il un acompte ?",
    answer: "Un acompte de 30% est demandé pour toute réservation, déductible du montant final. Cela nous permet de garantir votre créneau et d'organiser au mieux nos services.",
    category: "paiement"
  },
  {
    id: 3,
    question: "Combien de temps à l'avance dois-je réserver ?",
    answer: "Nous recommandons de réserver au moins 1 à 2 semaines à l'avance, surtout pour les périodes chargées (week-ends, vacances). Les créneaux disponibles sont visibles dans notre calendrier.",
    category: "organisation"
  },
  {
    id: 4,
    question: "Quels types de coiffures proposez-vous ?",
    answer: "Nous proposons une large gamme de tresses africaines modernes : Box Braids, Knotless Braids, Fulani Braids, Cornrows, Goddess Braids, Boho Braids, et bien d'autres. Chaque style est personnalisable.",
    category: "services"
  },
  {
    id: 5,
    question: "Puis-je modifier ou annuler mon rendez-vous ?",
    answer: "Oui, vous pouvez modifier ou annuler gratuitement jusqu'à 48h avant votre rendez-vous. Passé ce délai, l'acompte ne sera pas remboursé. Contactez-nous directement par WhatsApp.",
    category: "organisation"
  },
  {
    id: 6,
    question: "Quels sont vos horaires d'ouverture ?",
    answer: "Notre salon est ouvert du mardi au samedi de 9h à 19h. Les créneaux sont disponibles dans notre calendrier de réservation. Fermeture le dimanche et lundi.",
    category: "organisation"
  },
  {
    id: 7,
    question: "Utilisez-vous des produits adaptés à tous les types de cheveux ?",
    answer: "Absolument. Nous travaillons exclusivement avec des produits naturels et respectueux de la fibre capillaire. Notre expertise couvre tous les types de cheveux, des plus fins aux plus crépus.",
    category: "qualité"
  },
  {
    id: 8,
    question: "Combien de temps dure une séance ?",
    answer: "La durée varie selon le style choisi : comptez 2 à 6 heures. Box Braids Large : 2-3h, Knotless Medium : 4-5h, Fulani Braids : 4-6h. Vous êtes bien sûr invitée à venir avec votre téléphone, nous avons le Wi-Fi.",
    category: "services"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTIMONIALS (Avis clients)
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: 5;
  text: string;
  date: string;
  avatar: string;
  service: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sophie M.",
    role: "Cliente fidèle",
    rating: 5,
    text: "Un salon d'exception. La précision des tresses est remarquable, et l'accueil est chaleureux. Je n'irai plus ailleurs.",
    date: "Il y a 2 semaines",
    avatar: "/images/avatar-1.jpg",
    service: "Box Braids"
  },
  {
    id: 2,
    name: "Amara K.",
    role: "Nouvelle cliente",
    rating: 5,
    text: "J'ai découvert LN Touch grâce à une amie. L'ambiance est apaisante, le résultat dépasse mes attentes. Mention spéciale pour le soin des cheveux.",
    date: "Il y a 1 mois",
    avatar: "/images/avatar-2.jpg",
    service: "Knotless Braids"
  },
  {
    id: 3,
    name: "Isabelle D.",
    role: "Cliente régulière",
    rating: 5,
    text: "Professionnalisme, créativité et bienveillance. Chaque visite est un moment privilégié. Mes cheveux n'ont jamais été aussi beaux.",
    date: "Il y a 3 semaines",
    avatar: "/images/avatar-3.jpg",
    service: "Fulani Braids"
  },
  {
    id: 4,
    name: "Nadia T.",
    role: "Influenceuse beauté",
    rating: 5,
    text: "Un véritable coup de cœur ! L'équipe est à l'écoute et maîtrise parfaitement les techniques traditionnelles revisitées. Je recommande les yeux fermés.",
    date: "Il y a 5 jours",
    avatar: "/images/avatar-4.jpg",
    service: "Cornrows"
  },
  {
    id: 5,
    name: "Marie L.",
    role: "Cliente",
    rating: 5,
    text: "Enfin un salon qui comprend mes attentes ! Résultat impeccable, tenue parfaite. L'expérience LN Touch est unique.",
    date: "Il y a 2 mois",
    avatar: "/images/avatar-5.jpg",
    service: "Goddess Braids"
  },
  {
    id: 6,
    name: "Fatima B.",
    role: "Ambassadrice",
    rating: 5,
    text: "L'excellence à l'état pur. Chaque détail est pensé pour sublimer la beauté naturelle. Un salon qui mérite sa réputation.",
    date: "Il y a 1 semaine",
    avatar: "/images/avatar-6.jpg",
    service: "Box Braids"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROCESS / RÉSERVATION (Extras uniquement, car STYLES vient de COIFFURES)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExtraOption {
  id: string;
  label: string;
  icon: string;
  price: string;
}

export const EXTRAS: ExtraOption[] = [
  { id: "soin",       label: "Soin capillaire",      icon: "✦", price: "+15€" },
  { id: "demelage",   label: "Démêlage inclus",      icon: "◇", price: "+10€" },
  { id: "accessoires",label: "Accessoires / perles", icon: "○", price: "+8€"  },
  { id: "couleur",    label: "Rajouts colorés",      icon: "△", price: "+20€" },
  { id: "retouche",   label: "Retouche frontale",    icon: "□", price: "+12€" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. DISPONIBILITÉS (Créneaux du calendrier)
// ─────────────────────────────────────────────────────────────────────────────

export const AVAILABILITIES: Record<string, string[]> = {
  "2026-04-15": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-04-16": ["09:00","10:00","13:00"],
  "2026-04-17": [],
  "2026-04-18": ["10:00","11:00","12:00","15:00","17:00"],
  "2026-04-19": ["09:00","14:00","16:00"],
  "2026-04-20": ["10:00","11:00","15:00"],
  "2026-04-22": ["09:00","10:00","11:00","13:00","14:00","15:00","16:00"],
  "2026-04-23": ["10:00","11:00","14:00"],
  "2026-04-24": ["09:00","15:00","16:00","17:00"],
  "2026-04-25": ["10:00","11:00","12:00","14:00"],
  "2026-04-26": ["09:00","10:00","16:00","17:00"],
  "2026-04-27": ["10:00","14:00","15:00"],
  "2026-04-28": ["10:00","14:00","15:00"],
  "2026-04-29": ["10:00","14:00","15:00"],
  "2026-04-30": ["10:00","14:00","15:00"],
  "2026-05-01": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-02": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-04": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-08": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-09": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-11": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-15": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-19": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-20": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-22": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-23": ["10:00","11:00","14:00","15:00","16:00"],
  "2026-05-26": ["10:00","11:00","14:00","15:00","16:00"],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. INFORMATIONS SALON
// ─────────────────────────────────────────────────────────────────────────────

export interface SalonInfo {
  name: string;
  commune: string;
  quartier: string;
  detail: string;
  mapLink: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: {
    mardi_samedi: string;
    dimanche_lundi: string;
  };
}

export const SALON: SalonInfo = {
  name: "LN Touch",
  commune: "Bandalungwa 18ème",
  quartier: "Abdoula",
  detail: "Proche métro bar et Tshibangu (Station Essence)",
  mapLink: "https://maps.google.com/?q=Bandalungwa+Kinshasa",
  phone: "+243 856 270 030",
  email: "contact@lntouch.com",
  whatsapp: "243856270030",
  hours: {
    mardi_samedi: "09:00 - 19:00",
    dimanche_lundi: "Fermé",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. INFORMATIONS FONDATRICE & DÉVELOPPEUR
// ─────────────────────────────────────────────────────────────────────────────

export interface FounderInfo {
  name: string;
  role: string;
  bio: string;
  experience: string;
}

export const FOUNDER: FounderInfo = {
  name: "Leonie T.",
  role: "Fondatrice & Artiste Coiffeuse",
  bio: "Artiste coiffeuse depuis 18 ans, formée à Kinshasa. Sa vision : sublimer la beauté naturelle à travers des techniques traditionnelles revisitées avec une touche contemporaine.",
  experience: "18 ans d'expertise",
};

export interface DeveloperInfo {
  name: string;
  studio: string;
  bio: string;
  technologies: string;
}

export const DEVELOPER: DeveloperInfo = {
  name: "Christian Tuk's",
  studio: "Studio Créatif - LnXD",
  bio: "Design & développement par Christian Tuk's, passionné d'expériences digitales premium.",
  technologies: "Next.js · GSAP · Three.js",
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. RÉSEAUX SOCIAUX
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: "instagram" | "facebook" | "tiktok" | "pinterest";
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "instagram", href: "https://www.instagram.com/lntouch12" },
  { platform: "facebook", href: "https://www.instagram.com/lntouch12" },
  { platform: "tiktok", href: "https://www.tiktok.com/@_leoniiie.t" },
  { platform: "pinterest", href: "https://www.instagram.com/lntouch12" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. HELPERS (Fonctions utilitaires)
// ─────────────────────────────────────────────────────────────────────────────

export function getCoiffureBySlug(slug: string): Coiffure | undefined {
  return COIFFURES.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return COIFFURES.map((c) => c.slug);
}