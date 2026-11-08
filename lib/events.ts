export interface GameEvent {
  title: string;
  description: string;
  healthChange: number;
  moneyChange: number;
}

export const EVENTS: GameEvent[] = [
  {
    title: "Primeros Pasos",
    description: "Intentaste comerte una moneda del suelo. Sobreviviste pero tus padres gastaron en el médico.",
    healthChange: -5,
    moneyChange: -20,
  },
  {
    title: "Golpe de Suerte",
    description: "Encontraste una billetera en el parque y nadie te vio.",
    healthChange: 0,
    moneyChange: 50,
  },
  {
    title: "Gripe Fuerte",
    description: "El invierno fue brutal. Pasaste dos semanas en cama a base de té y paracetamol.",
    healthChange: -15,
    moneyChange: -10,
  },
  {
    title: "Trabajo Informal",
    description: "Ayudaste a tu vecino a pintar su casa. Te pagó bien y te regaló una pizza.",
    healthChange: 5,
    moneyChange: 40,
  },
  {
    title: "Cripto Estafa",
    description: "Un amigo de la infancia te convenció de invertir en 'DogeCoin2'. Perdiste casi todo.",
    healthChange: -10,
    moneyChange: -80,
  },
  {
    title: "Día de Gimnasio",
    description: "Empezaste a levantar pesas. Te duele todo pero te sientes más fuerte.",
    healthChange: 15,
    moneyChange: -15,
  },
  {
    title: "Lotería Instantánea",
    description: "Compraste un raspadito de 1 dólar y ganaste un premio menor.",
    healthChange: 5,
    moneyChange: 100,
  },
  {
    title: "Intoxicación Alimentaria",
    description: "Esos tacos callejeros no se veían muy frescos, pero el hambre pudo más.",
    healthChange: -25,
    moneyChange: -5,
  }
];
