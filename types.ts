
export type PersonaKey = 'kim' | 'edward' | 'yolo';

export interface Persona {
  key: PersonaKey;
  name: string;
  image: string;
  description: string;
  color: string;
  tone: string;
  style: string;
}

export interface MenuProposal {
  name: string;
  reason: string;
}
