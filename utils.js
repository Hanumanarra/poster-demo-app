import {words} from "./words"
export function getRandomWord(){
    const randomIndex=Math.floor(Math.random()*words.length)
    return words[randomIndex]
}

export default function getFarewellText(language){
    const options=[
        `Farewell,${language}`,
        `Adios,${language}`,
        `R.I.P,${language}`,
        `We Will Miss You,${language}`,
        `Oh no not,${language}`,
        `${language},bites for dust`,
        `Gone but not forgetten,${language}`,
        `The end of ${language} as we Know it`,
        `Off into the sunset,${language}`,
        `${language} is been real`,
        `${language} Your watch has ended`,
        `${language} has left the building`
    ];
    const randomIndex=Math.floor(Math.random()*options.length)
    return options[randomIndex]
}