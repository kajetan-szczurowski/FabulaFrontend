export type characterDataType = {
  id: string,
  name: string,
  graphicUrl: string,

  maxHP: string,
  currentHP: string,
  maxEP: string,
  currentEP: string,
  maxMagic: string,
  currentMagic: string,

  about: characterBasicValueType[],
  actions: characterBasicValueType[],
  EQ: characterBasicValueType[],
  skills: skillType[],
  spells: spellType[]
  rolls: characterBasicValueType[],
  relations: relationType[]

}

export type elementType = characterBasicValueType & {
  investedPoints?: string,
  target?:string,
  duration?:string,
  magicCost?: string
}

export type characterBasicValueType = {
  label: string,
  id: string,
  description: string
}

export type skillType = characterBasicValueType & {
  investedPoints: string
}

export type spellType = characterBasicValueType & {
  target: string,
  duration: string,
  magicCost: string
}

export type relationType = {
  label: string,
  id: string,
  emotions: emotionForceType[] 
}

export type emotionForceType = 0 | 1 | 2;