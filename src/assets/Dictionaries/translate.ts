export function translate(input: string){
    const word = input.toLowerCase();
    const dictionary = getDictionary();
    if (dictionary[word]) return dictionary[word];
    return input;

}

function getDictionary(): {[key: string]: string} {
    return {
        "pronounce": "zaimki",
        "agility": "zręczność",
        "power": "potęga",
        "will": "wola",
        "inside": "wejrzenie",
        "initiative": "inicjatywa",
        "armor": "pancerz",
        "magicaldefence": "obrona magiczna",
        "identity": "tożsamość",
        "theme": "motyw",
        "origin": "pochodzenie",
        "level": "poziom doświadczenia",
        "classes": "klasy",
        "experience": "doświadczenie",
        "fabulapoints": "punkty fabuli",
        "about": "o postaci",
        "spells": "zaklęcia",
        "skills": "umiejętności",
        "EQ": "ekwipunek",
        "actions": "akcje",
        "changing": "zmienianie",
        "delete": "usuń",
        "are you sure? this action is irreversible.": "Na pewno? Ta akcja jest nieodwracalna",
        "no": "nie",
        "yes, delete": "tak, usuń",
        "magic's cost": "PM",
        "duration": "czas trwania",
        "target": "cel"


    }
}