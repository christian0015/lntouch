// lib/coiffures.ts  — source unique pour toutes les coiffures LN Touch

export interface Coiffure {
  slug: string;
  name: string;
  variant: string;
  tagline: string;
  description: string;         // paragraph 1 — histoire / identité
  technique: string;           // paragraph 2 — comment ça se pose
  conseil: string;             // paragraph 3 — entretien / durée de vie
  duration: string;
  hold: string;
  price: string;
  ideal: string;               // pour qui ?
  images: string[];            // [hero, mid, detail]  (2–3 imgs)
  accent: string;              // couleur d'accent de la card gallery
  instagram: string;
  whatsapp: string;            // numéro complet avec indicatif, ex: "33612345678"
  related: string[];           // slugs des coiffures similaires
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const WA = "33600000000"; // ← remplace par le vrai numéro WhatsApp du salon

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
      "/images/knotless_medium.jpg",
      "/images/knotless_medium_2.jpg",
      "/images/knotless_medium_3.jpg",
    ],
    accent: "#c9a97a",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["knotless-braids-large", "boho-braids-long", "fulani-braids"],
    seo: {
      title: "Knotless Braids Medium – Tresses sans nœud | LN Touch Paris",
      description:
        "Knotless Braids Medium à Paris : tresses protectrices sans tension, naturelles et durables. Résultat en 4–5h dès 80€. Réservez chez LN Touch.",
      keywords: ["knotless braids medium", "tresses sans nœud Paris", "tresses protectrices", "LN Touch", "salon tresses africaines Paris"],
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
      "/images/knotless_large.jpg",
      "/images/knotless_large_2.jpg",
      "/images/knotless_large_3.jpg",
    ],
    accent: "#e8c4a0",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["knotless-braids-medium", "braided-ponytail", "fulani-braids"],
    seo: {
      title: "Knotless Braids Large – Tresses bold & rapides | LN Touch Paris",
      description:
        "Knotless Braids Large à Paris : tresses épaisses, impact immédiat en 2–3h, dès 60€. Salon LN Touch, Château Rouge.",
      keywords: ["knotless braids large", "tresses épaisses Paris", "box braids", "LN Touch", "tresses africaines"],
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
      "/images/boho_short.jpg",
      "/images/boho_short_2.jpg",
      "/images/boho_short_3.jpg",
    ],
    accent: "#b8956a",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["boho-braids-long", "knotless-braids-medium", "french-curl"],
    seo: {
      title: "Boho Braids Short – Tresses bohèmes légères | LN Touch Paris",
      description:
        "Boho Braids Short à Paris : tresses avec boucles libres, style bohème naturel. Session 3–4h dès 70€. LN Touch, Château Rouge.",
      keywords: ["boho braids Paris", "tresses bohèmes", "tresses boucles", "LN Touch", "coiffure africaine Paris"],
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
      "/images/boho_long.jpg",
      "/images/boho_long_2.jpg",
      "/images/boho_long_3.jpg",
    ],
    accent: "#d4a882",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["boho-braids-short", "french-curl", "knotless-braids-medium"],
    seo: {
      title: "Boho Braids Long – Tresses longues romantiques | LN Touch Paris",
      description:
        "Boho Braids Long à Paris : tresses longues avec boucles libres, style romantique et signature. Dès 90€. Salon LN Touch.",
      keywords: ["boho braids long Paris", "tresses longues boucles", "tresses romantiques", "LN Touch Paris"],
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
      "/images/fulani_braids.png",
      "/images/fulani_braids_2.jpg",
      "/images/fulani_braids_3.jpg",
    ],
    accent: "#c4a05a",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["fulani-crochet", "knotless-braids-medium", "braided-ponytail"],
    seo: {
      title: "Fulani Braids – Tresses africaines traditionnelles | LN Touch Paris",
      description:
        "Fulani Braids à Paris : tresses africaines avec motif central et accessoires. Héritage et modernité. Dès 85€. LN Touch, Château Rouge.",
      keywords: ["fulani braids Paris", "tresses africaines Paris", "tresses traditionnelles", "LN Touch", "coiffure africaine"],
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
      "/images/fulani_crochet.jpg",
      "/images/fulani_crochet_2.jpg",
      "/images/fulani_crochet_3.jpg",
    ],
    accent: "#d6b87a",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["fulani-braids", "knotless-braids-large", "braided-ponytail"],
    seo: {
      title: "Fulani Crochet – Style Fulani rapide & accessible | LN Touch Paris",
      description:
        "Fulani Crochet à Paris : look Fulani en 2–3h dès 55€. Technique crochet sur cornrows. Salon LN Touch, Château Rouge.",
      keywords: ["fulani crochet Paris", "crochet braids Paris", "tresses crochet", "LN Touch Paris"],
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
      "/images/braided_ponytail.jpg",
      "/images/braided_ponytail_2.jpg",
      "/images/braided_ponytail_3.jpg",
    ],
    accent: "#b09070",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["knotless-braids-medium", "fulani-braids", "knotless-braids-large"],
    seo: {
      title: "Braided Ponytail – Queue tressée élégante | LN Touch Paris",
      description:
        "Braided Ponytail à Paris : queue de cheval tressée sophistiquée, idéale bureau ou soirée. Dès 50€. LN Touch, Château Rouge.",
      keywords: ["braided ponytail Paris", "queue tressée Paris", "cornrows queue", "LN Touch Paris", "tresses élégantes"],
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
      "/images/french_curl.jpg",
      "/images/french_curl_2.jpg",
      "/images/french_curl_3.jpg",
    ],
    accent: "#c8a090",
    instagram: "https://www.instagram.com/lntouch/",
    whatsapp: WA,
    related: ["boho-braids-long", "boho-braids-short", "fulani-braids"],
    seo: {
      title: "French Curl – Boucles spirales glamour | LN Touch Paris",
      description:
        "French Curl à Paris : boucles spirales volumineuses, look glamour pour occasions spéciales. Dès 75€. Salon LN Touch.",
      keywords: ["french curl Paris", "boucles spirales Paris", "crochet curl", "LN Touch Paris", "coiffure glamour africaine"],
    },
  },
];

export function getCoiffureBySlug(slug: string): Coiffure | undefined {
  return COIFFURES.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return COIFFURES.map((c) => c.slug);
}